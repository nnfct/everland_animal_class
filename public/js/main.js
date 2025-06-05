document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 가져오기 ---
    const uploadForm = document.getElementById('uploadForm');
    const imageFile = document.getElementById('imageFile');
    const predictionResultDiv = document.getElementById('predictionResult');

    const startCameraBtn = document.getElementById('startCameraBtn');
    const cameraPreviewContainer = document.getElementById('cameraPreviewContainer');
    const cameraPreview = document.getElementById('cameraPreview');
    const captureCanvas = document.getElementById('captureCanvas');
    const captureBtn = document.getElementById('captureBtn');
    const stopCameraBtn = document.getElementById('stopCameraBtn');
    
    let stream = null; // 현재 활성화된 카메라 스트림을 저장할 변수

    // --- 1. 파일 업로드 기능 ---
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // 폼의 기본 제출 동작(새로고침) 방지

            if (!imageFile.files || imageFile.files.length === 0) {
                showPredictionResult('판별할 이미지를 선택해주세요.', 'error');
                return;
            }

            const formData = new FormData(); // 서버로 보낼 데이터 객체 생성
            formData.append('image', imageFile.files[0]); // 'image'라는 이름으로 선택된 파일 추가
            
            await predictImage(formData); // 공통 예측 함수 호출
        });
    }

    // --- 2. 카메라 기능 ---
    // "카메라 켜기" 버튼 클릭 시
    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', async () => {
            try {
                // 이미 스트림이 실행 중이면 먼저 중지 (예: 껐다가 다시 켤 때)
                if (stream) {
                    stopCameraStream();
                }

                // 사용자에게 카메라 사용 권한 요청 (비디오만, 오디오는 false)
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                
                // <video> 요소에 카메라 스트림 연결하여 미리보기 시작
                cameraPreview.srcObject = stream;
                // cameraPreview.play(); // autoplay 속성이 있어서 명시적 play는 필요 없을 수 있음

                // UI 업데이트: 카메라 관련 컨테이너 보이기, 시작 버튼 숨기기
                cameraPreviewContainer.style.display = 'block';
                startCameraBtn.style.display = 'none';
                showPredictionResult(''); // 이전 결과 메시지 초기화
            } catch (err) {
                console.error("카메라 접근 오류:", err);
                showPredictionResult(`카메라 접근 오류: ${err.message}. 권한을 확인해주세요.`, 'error');
                // HTTPS 환경인지 확인 (http://localhost 는 예외적으로 허용될 수 있음)
                if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                    showPredictionResult('카메라 기능은 HTTPS 또는 localhost 환경에서만 작동합니다.', 'error');
                }
            }
        });
    }

    // "사진 찍고 판별하기" 버튼 클릭 시
    if (captureBtn) {
        captureBtn.addEventListener('click', async () => {
            if (!stream || !cameraPreview.srcObject || cameraPreview.paused || cameraPreview.ended) {
                showPredictionResult("카메라가 켜져 있지 않거나 스트림이 없습니다.", 'error');
                return;
            }

            // <canvas>의 크기를 현재 비디오 미리보기의 실제 크기로 설정
            captureCanvas.width = cameraPreview.videoWidth;
            captureCanvas.height = cameraPreview.videoHeight;

            // <canvas>에 현재 비디오 프레임을 그림
            const context = captureCanvas.getContext('2d');
            context.drawImage(cameraPreview, 0, 0, captureCanvas.width, captureCanvas.height);

            // <canvas>의 이미지를 Blob 객체로 변환 (JPEG 형식, 품질 0.9)
            captureCanvas.toBlob(async (blob) => {
                if (!blob) {
                    showPredictionResult("이미지 캡처에 실패했습니다.", 'error');
                    return;
                }
                const formData = new FormData();
                formData.append('image', blob, 'captured_image.jpg'); // 'image' 필드명, 파일명 지정
                
                await predictImage(formData); // 공통 예측 함수 호출

                // 선택 사항: 사진을 찍은 후 카메라를 자동으로 끄고 싶다면 아래 주석 해제
                // stopCameraStream();
                // startCameraBtn.style.display = 'block';
                // cameraPreviewContainer.style.display = 'none';

            }, 'image/jpeg', 0.9); 
        });
    }

    // "카메라 끄기" 버튼 클릭 시
    if (stopCameraBtn) {
        stopCameraBtn.addEventListener('click', () => {
            stopCameraStream(); // 카메라 스트림 중지 함수 호출
            // UI 업데이트
            startCameraBtn.style.display = 'block';
            cameraPreviewContainer.style.display = 'none';
            showPredictionResult('카메라가 꺼졌습니다.');
        });
    }

    // 카메라 스트림 중지 함수
    function stopCameraStream() {
        if (stream) {
            const tracks = stream.getTracks(); // 스트림의 모든 트랙(비디오, 오디오) 가져오기
            tracks.forEach(track => track.stop()); // 각 트랙 중지
            stream = null; // 스트림 변수 초기화
            cameraPreview.srcObject = null; // <video> 요소의 srcObject도 null로 설정
        }
    }

    // --- 3. 공통 함수: 이미지 예측 및 결과 표시 ---
    async function predictImage(formData) {
        showPredictionResult('판별 중... 이미지를 분석하고 있습니다.', 'loading'); // 로딩 메시지 표시

        try {
            // 서버의 /predict 엔드포인트로 POST 요청 (FormData 전송)
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
                // FormData 사용 시 'Content-Type' 헤더는 브라우저가 자동으로 'multipart/form-data'로 설정
            });

            // 응답이 성공적이지 않으면 오류 처리
            if (!response.ok) {
                // 서버에서 JSON 형태의 오류 메시지를 보냈다고 가정하고 파싱 시도
                const errorData = await response.json().catch(() => {
                    // JSON 파싱 실패 시 일반적인 HTTP 오류 메시지 생성
                    return { error: `서버 오류: ${response.status} ${response.statusText}` };
                });
                throw new Error(errorData.error || `API 요청 실패: ${response.status}`);
            }

            // 응답이 성공적이면 JSON 데이터 파싱
            const result = await response.json();
            // 결과 메시지 유형에 따라 스타일 적용 (JavaScript에서 직접 판단하거나, 서버 응답에 type 추가)
            if (result.message.includes("입니다")) {
                 showPredictionResult(result.message, 'success-animal');
            } else if (result.message.includes("판별하기 어렵습니다")) {
                showPredictionResult(result.message, 'warning');
            } else {
                showPredictionResult(result.message); // 기본 정보 메시지
            }

        } catch (error) {
            console.error("판별 요청 오류:", error);
            showPredictionResult(`오류 발생: ${error.message}`, 'error');
        }
    }

    // 결과 메시지를 화면에 표시하고 스타일을 적용하는 함수
    function showPredictionResult(message, type = 'info') { // 기본 타입을 'info'로 설정
        predictionResultDiv.textContent = message;
        // 기존 클래스를 모두 제거하고 새로운 타입에 맞는 클래스만 추가 (더 깔끔한 방식)
        predictionResultDiv.className = 'prediction-message'; // 기본 클래스 항상 유지

        if (type === 'error') {
            predictionResultDiv.classList.add('error');
        } else if (type === 'success-animal') {
            predictionResultDiv.classList.add('success-animal');
        } else if (type === 'warning') {
            predictionResultDiv.classList.add('warning');
        } else if (type === 'loading') {
            predictionResultDiv.classList.add('loading');
        }
        // 'info' 타입은 기본 클래스만 사용 (특별한 스타일 없음)
    }
});