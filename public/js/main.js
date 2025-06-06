// public/js/main.js

// animalInfo 객체 및 loadAnimalData 함수는 이전과 동일하게 유지
let animalInfo = {};
async function loadAnimalData() {
    console.log("동물 정보 로드 시도...");
    try {
        const response = await fetch('js/animaldata.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, ${response.statusText}`);
        }
        animalInfo = await response.json();
        console.log("동물 정보 로드 완료:", JSON.stringify(animalInfo, null, 2));
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

    const uploadedImagePreview = document.createElement('img');
    uploadedImagePreview.id = 'uploadedImagePreview';
    if (predictionResultDiv && predictionResultDiv.parentNode) {
        predictionResultDiv.parentNode.insertBefore(uploadedImagePreview, predictionResultDiv);
    }

    const switchCameraBtn = document.createElement('button');
    switchCameraBtn.id = 'switchCameraBtn';
    switchCameraBtn.textContent = '카메라 전환';
    switchCameraBtn.type = 'button';
    if (startCameraBtn && startCameraBtn.parentNode) {
        if (stopCameraBtn && stopCameraBtn.parentNode === startCameraBtn.parentNode) {
            startCameraBtn.parentNode.insertBefore(switchCameraBtn, stopCameraBtn);
        } else {
            startCameraBtn.parentNode.insertBefore(switchCameraBtn, startCameraBtn.nextSibling);
        }
    }
    switchCameraBtn.style.display = 'none';

    const animalInfoContainer = document.getElementById('animalInfoContainer');
    const animalSimpleDesc = document.getElementById('animalSimpleDesc');
    const toggleDetailedInfoBtn = document.getElementById('toggleDetailedInfoBtn');
    const animalDetailedInfo = document.getElementById('animalDetailedInfo');


    let stream = null;
    let currentFacingMode = 'user';


    // --- 공통: 이미지 판별 요청을 백엔드로 보내는 함수 ---
    async function sendImageForPrediction(fileBlob) { /* ... 이전 답변의 최신 버전 그대로 사용 ... */
        showPredictionResult('판별 중... 이미지를 분석하고 있습니다.', 'loading');
        uploadedImagePreview.style.display = 'none';
        uploadedImagePreview.src = '';
        if (animalInfoContainer) animalInfoContainer.style.display = 'none';

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
            let resultMessage = data.message;
            let messageType = 'info';
            let detectedAnimalName = null;

            if (resultMessage.includes("입니다")) {
                messageType = 'success-animal';
                const match = resultMessage.match(/이것은 (.*?)(입니다|으로 판별됩니다)/);
                if (match && match[1]) {
                    detectedAnimalName = match[1].trim();
                }
            } else if (resultMessage.includes("판별하기 어렵습니다")) {
                messageType = 'warning';
            }
            showPredictionResult(resultMessage, messageType);

            console.log("AI 판별 결과 (JSON 키로 사용될 이름):", detectedAnimalName);

            if (detectedAnimalName && Object.keys(animalInfo).length > 0 && animalInfo[detectedAnimalName]) {
                console.log(`'${detectedAnimalName}' 키로 animalInfo에서 정보 찾음!`);
                const info = animalInfo[detectedAnimalName];
                if (animalSimpleDesc) animalSimpleDesc.textContent = info.summary || info.simpleDesc || "간단한 설명이 없습니다.";
                if (animalDetailedInfo) animalDetailedInfo.innerHTML = info.detail || info.detailedInfo || "<p>상세 정보가 없습니다.</p>";
                if (animalInfoContainer) animalInfoContainer.style.display = 'block';
                if (animalDetailedInfo) animalDetailedInfo.style.display = 'none';
                if (toggleDetailedInfoBtn) toggleDetailedInfoBtn.textContent = '상세 정보 보기';
            } else {
                console.warn(`'${detectedAnimalName}'에 대한 정보가 animaldata.json에 없습니다. JSON 키를 확인하세요. 또는 animalInfo 로드 실패.`);
                if (animalInfoContainer) animalInfoContainer.style.display = 'none';
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImagePreview.src = e.target.result;
                uploadedImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(fileBlob);

        } catch (error) {
            console.error("판별 요청 오류:", error);
            showPredictionResult(`오류 발생: ${error.message}`, 'error');
            if (animalInfoContainer) animalInfoContainer.style.display = 'none';
        }
    }

    // --- 파일 업로드 기능 ---
    if (uploadForm) { /* ... 이전 로직과 동일 ... */
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


    // --- 카메라 기능 (전체 화면 로직 포함) ---
    async function startCamera(facingMode = 'user') {
        if (stream) { stream.getTracks().forEach(track => track.stop()); }
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode }, audio: false });
            cameraPreview.srcObject = stream;
            
            cameraPreviewContainer.style.display = 'flex';
            startCameraBtn.style.display = 'none';
            captureBtn.style.display = 'inline-block';
            stopCameraBtn.style.display = 'inline-block';
            switchCameraBtn.style.display = 'inline-block'; // **카메라 시작 시 전환 버튼 항상 표시**

            showPredictionResult('');
            uploadedImagePreview.style.display = 'none';
            uploadedImagePreview.src = '';
            if(animalInfoContainer) animalInfoContainer.style.display = 'none';
            currentFacingMode = facingMode;

            // 전체 화면 요청
            if (cameraPreviewContainer.requestFullscreen) {
                await cameraPreviewContainer.requestFullscreen().catch(err => console.warn("전체 화면 요청 실패:", err.message));
            } else if (cameraPreviewContainer.webkitRequestFullscreen) {
                await cameraPreviewContainer.webkitRequestFullscreen().catch(err => console.warn("전체 화면 요청 실패 (Safari):", err.message));
            } else if (cameraPreviewContainer.msRequestFullscreen) {
                await cameraPreviewContainer.msRequestFullscreen().catch(err => console.warn("전체 화면 요청 실패 (IE11):", err.message));
            }
            // cameraPreviewContainer.classList.add('fullscreen-mode'); // fullscreenchange 이벤트 핸들러에서 처리

        } catch (err) {
            console.error("카메라 접근 오류:", err);
            showPredictionResult(`카메라 접근 오류: ${err.message}. 권한을 확인해주세요.`, 'error');
            if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                showPredictionResult('카메라 기능은 HTTPS 또는 localhost 환경에서만 작동합니다.', 'error');
            }
            cameraPreviewContainer.classList.remove('fullscreen-mode');
            cameraPreviewContainer.style.display = 'none';
            startCameraBtn.style.display = 'block';
            captureBtn.style.display = 'none';
            stopCameraBtn.style.display = 'none';
            switchCameraBtn.style.display = 'none';
        }
    }

    function stopCameraStream() {
        let wasFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            cameraPreview.srcObject = null;
        }

        // 전체 화면 종료 (만약 전체 화면 상태였다면)
        if (wasFullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(err => console.warn("전체 화면 종료 실패:", err.message));
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        // fullscreen-mode 클래스는 fullscreenchange 이벤트 핸들러에서 제거됨

        // UI 초기화
        cameraPreviewContainer.style.display = 'none';
        startCameraBtn.style.display = 'block';
        captureBtn.style.display = 'none';
        stopCameraBtn.style.display = 'none';
        switchCameraBtn.style.display = 'none';
        showPredictionResult('카메라가 꺼졌습니다.');
        uploadedImagePreview.style.display = 'none';
        uploadedImagePreview.src = '';
        if(animalInfoContainer) animalInfoContainer.style.display = 'none';
    }

    // 전체 화면 변경 이벤트 리스너
    function handleFullscreenChange() {
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
        console.log("전체 화면 상태 변경됨. 현재 전체 화면:", isFullscreen);

        if (isFullscreen) {
            cameraPreviewContainer.classList.add('fullscreen-mode');
            // 전체 화면 모드 진입 시, 버튼들은 CSS에 의해 이미 배치되어 있을 것임
            // startCamera 함수에서 이미 버튼들을 표시했으므로, 여기서는 클래스 추가만.
        } else {
            // 전체 화면 모드가 종료되었을 때 (예: ESC 키 누름)
            cameraPreviewContainer.classList.remove('fullscreen-mode');
            // 스트림이 여전히 활성 상태라면 일반 카메라 UI를 유지
            if (stream) {
                cameraPreviewContainer.style.display = 'flex'; // 일반 모드 flex로 복원
                startCameraBtn.style.display = 'none';
                captureBtn.style.display = 'inline-block';
                stopCameraBtn.style.display = 'inline-block';
                switchCameraBtn.style.display = 'inline-block'; // **ESC로 전체화면 종료 시 전환 버튼 다시 표시**
            } else {
                // 스트림이 없다면 (stopCameraStream이 호출된 경우 등) UI는 이미 초기화됨
                // startCameraBtn.style.display = 'block'; // 이 부분은 stopCameraStream에서 처리
            }
        }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    // --- 이벤트 리스너들 ---
    if (startCameraBtn) { startCameraBtn.addEventListener('click', async () => { if (stream) { stopCameraStream(); } else { await startCamera(currentFacingMode); } }); }
    if (stopCameraBtn) { stopCameraBtn.addEventListener('click', () => { stopCameraStream(); }); }
    if (switchCameraBtn) { switchCameraBtn.addEventListener('click', async () => { currentFacingMode = (currentFacingMode === 'user' ? 'environment' : 'user'); await startCamera(currentFacingMode); }); }
    if (captureBtn) { /* ... 이전 캡처 버튼 로직 ... */
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
            }, 'image/jpeg', 0.9);
        });
    }


    if (toggleDetailedInfoBtn) { /* ... 이전 토글 버튼 로직 ... */ }

    function showPredictionResult(message, type = 'info') { /* ... 이전 함수 내용 ... */ }

    console.log("main.js 초기화 완료");
});