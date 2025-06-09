// public/js/main.js

let animalInfo = {};
async function loadAnimalData() {
    console.log("동물 정보 로드 시도...");
    try {
        const response = await fetch('js/animaldata.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, ${response.statusText}`);
        }
        animalInfo = await response.json();
        console.log("동물 정보 로드 완료");
    } catch (error) {
        console.error("동물 정보 로드 실패:", error);
        if(document.getElementById('predictionResult')) {
            document.getElementById('predictionResult').textContent = "동물 정보를 불러오는 데 실패했습니다. 새로고침 해주세요.";
            document.getElementById('predictionResult').className = 'prediction-message error';
        }
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM 로드 완료, main.js 초기화 시작");
    await loadAnimalData();

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
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    // 카메라 전환 버튼 생성 및 삽입
    const switchCameraBtn = document.createElement('button');
    switchCameraBtn.id = 'switchCameraBtn';
    switchCameraBtn.textContent = '카메라 전환';
    switchCameraBtn.type = 'button';
    fullscreenBtn.parentNode.insertBefore(switchCameraBtn, fullscreenBtn);

    const uploadedImagePreview = document.createElement('img');
    uploadedImagePreview.id = 'uploadedImagePreview';
    predictionResultDiv.parentNode.insertBefore(uploadedImagePreview, predictionResultDiv);

    const animalInfoContainer = document.getElementById('animalInfoContainer');
    const animalSimpleDesc = document.getElementById('animalSimpleDesc');
    const toggleDetailedInfoBtn = document.getElementById('toggleDetailedInfoBtn');
    const animalDetailedInfo = document.getElementById('animalDetailedInfo');

    // --- 상태 변수 선언 ---
    let stream = null;
    let currentFacingMode = 'user';
    let hasMultipleCameras = false;
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // --- 기능 함수들 ---

    // 카메라 기능 지원 여부 확인
    async function checkCameraCapabilities() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            console.warn("enumerateDevices를 지원하지 않는 브라우저입니다.");
            return;
        }
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            hasMultipleCameras = devices.filter(d => d.kind === 'videoinput').length > 1;
            console.log(isTouchDevice ? "터치 기기 감지" : "PC 환경 감지");
            console.log(hasMultipleCameras ? "카메라 전환 가능" : "단일 카메라 감지");
        } catch (err) {
            console.error("카메라 장치 확인 오류:", err);
        }
    }
    checkCameraCapabilities();

    // 이미지 판별 요청
    async function sendImageForPrediction(fileBlob) {
        showPredictionResult('판별 중... 이미지를 분석하고 있습니다.', 'loading');
        uploadedImagePreview.style.display = 'none';
        uploadedImagePreview.src = '';
        if (animalInfoContainer) animalInfoContainer.style.display = 'none';

        const formData = new FormData();
        formData.append('image', fileBlob, 'image.jpg');

        try {
            const response = await fetch('/predict', { method: 'POST', body: formData });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: `서버 오류: ${response.status}` }));
                throw new Error(errorData.error);
            }

            const data = await response.json();
            let resultMessage = data.message;
            let messageType = 'info';
            let detectedAnimalName = null;

            if (resultMessage.includes("입니다")) {
                messageType = 'success-animal';
                const match = resultMessage.match(/이것은 (.*?)(입니다|으로 판별됩니다)/);
                if (match && match[1]) detectedAnimalName = match[1].trim();
            } else if (resultMessage.includes("판별하기 어렵습니다")) {
                messageType = 'warning';
            }
            showPredictionResult(resultMessage, messageType);

            if (detectedAnimalName && animalInfo[detectedAnimalName]) {
                const info = animalInfo[detectedAnimalName];
                animalSimpleDesc.textContent = info.summary || "간단한 설명이 없습니다.";
                animalDetailedInfo.innerHTML = info.detail || "<p>상세 정보가 없습니다.</p>";
                animalInfoContainer.style.display = 'block';
                animalDetailedInfo.style.display = 'none';
                toggleDetailedInfoBtn.textContent = '상세 정보 보기';
            } else {
                animalInfoContainer.style.display = 'none';
            }

            const reader = new FileReader();
            reader.onload = e => {
                uploadedImagePreview.src = e.target.result;
                uploadedImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(fileBlob);
        } catch (error) {
            console.error("판별 요청 오류:", error);
            showPredictionResult(`오류 발생: ${error.message}`, 'error');
            animalInfoContainer.style.display = 'none';
        }
    }

    // 카메라 시작
    async function startCamera(facingMode) {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        const constraints = { video: { facingMode: facingMode }, audio: false };

        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            cameraPreview.srcObject = stream;
            await cameraPreview.play();

            cameraPreviewContainer.style.display = 'flex';
            startCameraBtn.style.display = 'none';
            captureBtn.style.display = 'block';
            stopCameraBtn.style.display = 'block';
            fullscreenBtn.style.display = 'block';
            switchCameraBtn.style.display = hasMultipleCameras ? 'block' : 'none';
            
            showPredictionResult('카메라가 켜졌습니다.', 'info');
            currentFacingMode = facingMode;

            if (isTouchDevice) {
                requestAnimationFrame(() => {
                    cameraPreviewContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            } else {
                try {
                    await cameraPreviewContainer.requestFullscreen();
                } catch (err) {
                    console.warn("자동 전체 화면 진입 실패:", err.message);
                    showPredictionResult('카메라가 켜졌습니다. 전체 화면을 원하시면 버튼을 눌러주세요.', 'info');
                }
            }
        } catch (err) {
            console.error("카메라 접근 오류:", err);
            let errorMessage = `카메라 접근 오류: ${err.name}.`;
             if (window.location.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
                errorMessage += ' 중요: 카메라 기능은 보안 연결(HTTPS) 환경에서만 작동합니다.';
            }
            showPredictionResult(errorMessage, 'error');
            stopCameraStream();
        }
    }

    // 카메라 정지
    function stopCameraStream() {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }
        
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }

        cameraPreviewContainer.style.display = 'none';
        startCameraBtn.style.display = 'block';
        captureBtn.style.display = 'none';
        stopCameraBtn.style.display = 'none';
        fullscreenBtn.style.display = 'none';
        switchCameraBtn.style.display = 'none';
        
        if(predictionResultDiv.textContent.includes('카메라')) {
            showPredictionResult('카메라가 꺼졌습니다.');
        }
    }

    // 전체 화면 변경 핸들러
    function handleFullscreenChange() {
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
        cameraPreviewContainer.classList.toggle('fullscreen-mode', isFullscreen);
    }

    // 결과 메시지 표시
    function showPredictionResult(message, type = 'info') {
        if (!predictionResultDiv) return;
        predictionResultDiv.textContent = message;
        predictionResultDiv.className = `prediction-message ${type}`;
    }

    // --- 이벤트 리스너 설정 ---

    // 파일 업로드 폼
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const fileToUpload = imageFile.files[0];
            if (!fileToUpload) {
                showPredictionResult('판별할 이미지를 선택해주세요.', 'error');
                return;
            }
            if (stream) stopCameraStream();
            await sendImageForPrediction(fileToUpload);
        });
    }

    // 카메라 켜기 버튼
    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', () => {
            startCamera(hasMultipleCameras ? 'environment' : 'user');
        });
    }

    // 카메라 끄기 버튼
    if (stopCameraBtn) { stopCameraBtn.addEventListener('click', stopCameraStream); }

    // 전체 화면 버튼
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', async () => {
            if (!document.fullscreenElement) {
                await cameraPreviewContainer.requestFullscreen().catch(err => {
                    alert('전체 화면 모드를 시작할 수 없습니다: ' + err.message);
                });
            }
        });
    }

    // 카메라 전환 버튼
    if (switchCameraBtn) {
        switchCameraBtn.addEventListener('click', () => {
            if (!stream) return;
            currentFacingMode = (currentFacingMode === 'user' ? 'environment' : 'user');
            startCamera(currentFacingMode);
        });
    }

    // 사진 찍기 버튼
    if (captureBtn) {
        captureBtn.addEventListener('click', async () => {
            if (!stream) return;

            // 캡처 전 전체 화면 종료
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            }
            
            const context = captureCanvas.getContext('2d');
            captureCanvas.width = cameraPreview.videoWidth;
            captureCanvas.height = cameraPreview.videoHeight;
            
            if (currentFacingMode === 'user') { // 셀피 모드 좌우반전 보정
                context.save();
                context.scale(-1, 1);
                context.drawImage(cameraPreview, -captureCanvas.width, 0, captureCanvas.width, captureCanvas.height);
                context.restore();
            } else {
                context.drawImage(cameraPreview, 0, 0, captureCanvas.width, captureCanvas.height);
            }

            captureCanvas.toBlob(async (blob) => {
                stopCameraStream(); // blob 생성 후 카메라 정지
                if (blob) {
                    await sendImageForPrediction(blob);
                }
            }, 'image/jpeg', 0.9);
        });
    }
    
    // 상세 정보 토글 버튼
    if (toggleDetailedInfoBtn) {
        toggleDetailedInfoBtn.addEventListener('click', () => {
            const isHidden = animalDetailedInfo.style.display === 'none';
            animalDetailedInfo.style.display = isHidden ? 'block' : 'none';
            toggleDetailedInfoBtn.textContent = isHidden ? '상세 정보 숨기기' : '상세 정보 보기';
        });
    }

    // 전체 화면 변경 이벤트
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    console.log("main.js 초기화 완료");
});