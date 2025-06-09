// public/js/main.js

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

    // **추가된 요소: 업로드된 사진 미리보기용 <img> 태그 (JS에서 동적으로 생성)**
    const uploadedImagePreview = document.createElement('img');
    uploadedImagePreview.id = 'uploadedImagePreview';
    // CSS 파일에서 스타일 관리하므로 인라인 스타일은 제거합니다.
    // uploadedImagePreview.style.display = 'none'; // 초기에는 숨김
    // predictionResultDiv 바로 위에 삽입
    if (predictionResultDiv) {
        predictionResultDiv.parentNode.insertBefore(uploadedImagePreview, predictionResultDiv);
    }


    // **새로 추가된 카메라 전환 버튼 요소 (JS에서 동적으로 생성)**
    const switchCameraBtn = document.createElement('button');
    switchCameraBtn.id = 'switchCameraBtn';
    switchCameraBtn.textContent = '카메라 전환';
    switchCameraBtn.type = 'button';
    // startCameraBtn의 부모 노드에 삽입
    if (startCameraBtn) {
        // startCameraBtn과 stopCameraBtn 사이에 삽입되도록 조정
        // stopCameraBtn이 존재하는지 확인하여 그 앞에 삽입
        if (stopCameraBtn && stopCameraBtn.parentNode === startCameraBtn.parentNode) {
            startCameraBtn.parentNode.insertBefore(switchCameraBtn, stopCameraBtn);
        } else { // stopCameraBtn이 없거나 다른 위치에 있다면 startCameraBtn 뒤에 삽입
            startCameraBtn.parentNode.insertBefore(switchCameraBtn, startCameraBtn.nextSibling);
        }
    }
    switchCameraBtn.style.display = 'none'; // 초기에는 숨김


    let stream = null; // 현재 활성화된 카메라 스트림을 저장할 변수
    let currentFacingMode = 'user'; // 현재 카메라 모드: 'user' (전면), 'environment' (후면)


    // --- 공통: 이미지 판별 요청을 백엔드로 보내는 함수 ---
    async function sendImageForPrediction(fileBlob) {
        showPredictionResult('판별 중... 이미지를 분석하고 있습니다.', 'loading');

        // 이전 미리보기 초기화
        uploadedImagePreview.style.display = 'none';
        uploadedImagePreview.src = '';

        // 만약 Blob이 File 객체가 아니면 (카메라 캡처의 경우) 파일명 지정
        const fileName = fileBlob.name || 'image.jpg';
        const formData = new FormData();
        formData.append('image', fileBlob, fileName);

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => {
                    return { error: `서버 오류: ${response.status} ${response.statusText}` };
                });
                throw new Error(errorData.error || `API 요청 실패: ${response.status}`);
            }

            const data = await response.json();
            if (data.message.includes("입니다")) {
                 showPredictionResult(data.message, 'success-animal');
            } else if (data.message.includes("판별하기 어렵습니다")) {
                showPredictionResult(data.message, 'warning');
            } else {
                showPredictionResult(data.message);
            }

            // **추가된 부분: 업로드/캡처된 이미지 미리보기**
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImagePreview.src = e.target.result;
                uploadedImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(fileBlob);


        } catch (error) {
            console.error("판별 요청 오류:", error);
            showPredictionResult(`오류 발생: ${error.message}`, 'error');
        }
    }


    // --- 1. 파일 업로드 기능 ---
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!imageFile.files || imageFile.files.length === 0) {
                showPredictionResult('판별할 이미지를 선택해주세요.', 'error');
                return;
            }

            const fileToUpload = imageFile.files[0];

            // 카메라가 켜져 있다면 끄기
            if (stream) {
                stopCameraStream();
            }

            await sendImageForPrediction(fileToUpload);
        });
    }


    // --- 2. 카메라 기능 ---

    async function startCamera(facingMode = 'user') {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode },
                audio: false
            });
            cameraPreview.srcObject = stream;
            cameraPreviewContainer.style.display = 'block';
            startCameraBtn.style.display = 'none';
            captureBtn.style.display = 'inline-block';
            stopCameraBtn.style.display = 'inline-block';
            switchCameraBtn.style.display = 'inline-block'; // 카메라 전환 버튼 표시

            showPredictionResult('');
            uploadedImagePreview.style.display = 'none'; // 다른 미리보기 초기화
            uploadedImagePreview.src = '';

            currentFacingMode = facingMode;

        } catch (err) {
            console.error("카메라 접근 오류:", err);
            showPredictionResult(`카메라 접근 오류: ${err.message}. 권한을 확인해주세요.`, 'error');
            if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                showPredictionResult('카메라 기능은 HTTPS 또는 localhost 환경에서만 작동합니다.', 'error');
            }
            cameraPreviewContainer.style.display = 'none';
            startCameraBtn.style.display = 'block';
            captureBtn.style.display = 'none';
            stopCameraBtn.style.display = 'none';
            switchCameraBtn.style.display = 'none';
        }
    }

    function stopCameraStream() {
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            stream = null;
            cameraPreview.srcObject = null;
        }
        cameraPreviewContainer.style.display = 'none';
        startCameraBtn.style.display = 'block';
        captureBtn.style.display = 'none';
        stopCameraBtn.style.display = 'none';
        switchCameraBtn.style.display = 'none'; // 카메라 전환 버튼 숨김
        showPredictionResult('카메라가 꺼졌습니다.');
        uploadedImagePreview.style.display = 'none'; // 미리보기 초기화
        uploadedImagePreview.src = '';
    }


    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', async () => {
            if (stream) {
                stopCameraStream();
            } else {
                await startCamera(currentFacingMode);
            }
        });
    }

    if (stopCameraBtn) {
        stopCameraBtn.addEventListener('click', () => {
            stopCameraStream();
        });
    }

    // "카메라 전환" 버튼 클릭 시
    if (switchCameraBtn) {
        switchCameraBtn.addEventListener('click', async () => {
            currentFacingMode = (currentFacingMode === 'user' ? 'environment' : 'user');
            await startCamera(currentFacingMode);
        });
    }


    if (captureBtn) {
        captureBtn.addEventListener('click', async () => {
            if (!stream || !cameraPreview.srcObject || cameraPreview.paused || cameraPreview.ended) {
                showPredictionResult("카메라가 켜져 있지 않거나 스트림이 없습니다.", 'error');
                return;
            }

            captureCanvas.width = cameraPreview.videoWidth;
            captureCanvas.height = cameraPreview.videoHeight;
            const context = captureCanvas.getContext('2d');
            context.drawImage(cameraPreview, 0, 0, captureCanvas.width, captureCanvas.height);

            captureCanvas.toBlob(async (blob) => {
                if (!blob) {
                    showPredictionResult("이미지 캡처에 실패했습니다.", 'error');
                    return;
                }
                
                await sendImageForPrediction(blob);
                // 미리보기는 sendImageForPrediction 내부에서 처리됨
            }, 'image/jpeg', 0.9);
        });
    }

    function showPredictionResult(message, type = 'info') {
        predictionResultDiv.textContent = message;
        predictionResultDiv.className = 'prediction-message';

        if (type === 'error') {
            predictionResultDiv.classList.add('error');
        } else if (type === 'success-animal') {
            predictionResultDiv.classList.add('success-animal');
        } else if (type === 'warning') {
            predictionResultDiv.classList.add('warning');
        } else if (type === 'loading') {
            predictionResultDiv.classList.add('loading');
        }
    }
});