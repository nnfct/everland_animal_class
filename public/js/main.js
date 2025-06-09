// public/js/main.js

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM 로드 완료, main.js 초기화 시작");

    // --- DOM 요소 가져오기 (새로운 HTML 구조에 맞게) ---
    const imageFile = document.getElementById('imageFile');
    const startCameraBtn = document.getElementById('startCameraBtn');
    const goToQuizBtn = document.getElementById('goToQuizBtn');

    const cameraPreviewContainer = document.getElementById('cameraPreviewContainer');
    const cameraPreview = document.getElementById('cameraPreview');
    const captureCanvas = document.getElementById('captureCanvas');
    const captureBtn = document.getElementById('captureBtn');
    const stopCameraBtn = document.getElementById('stopCameraBtn');
    
    const predictionResultDiv = document.getElementById('predictionResult');
    const animalInfoContainer = document.getElementById('animalInfoContainer');
    const animalSimpleDesc = document.getElementById('animalSimpleDesc');
    const toggleDetailedInfoBtn = document.getElementById('toggleDetailedInfoBtn');
    const animalDetailedInfo = document.getElementById('animalDetailedInfo');

    // 카메라 전환 버튼 동적 생성 (새 디자인에 맞게 클래스 추가)
    const switchCameraBtn = document.createElement('button');
    switchCameraBtn.id = 'switchCameraBtn';
    switchCameraBtn.textContent = '카메라 전환';
    switchCameraBtn.className = 'button secondary'; // 새 디자인의 클래스 적용
    // captureBtn 앞에 삽입
    captureBtn.parentNode.insertBefore(switchCameraBtn, captureBtn);

    // --- 상태 변수 ---
    let stream = null;
    let currentFacingMode = 'user';
    let hasMultipleCameras = false;
    let animalInfo = {};

    // --- 기능 함수들 ---

    // 동물 정보 로드
    async function loadAnimalData() {
        try {
            const response = await fetch('js/animaldata.json');
            if (!response.ok) throw new Error('동물 정보 로드 실패');
            animalInfo = await response.json();
            console.log("동물 정보 로드 완료");
        } catch (error) {
            console.error(error);
            predictionResultDiv.textContent = "정보 로드에 실패했습니다. 새로고침 해주세요.";
            predictionResultDiv.style.display = 'block';
        }
    }
    await loadAnimalData();

    // 카메라 기능 확인
    async function checkCameraCapabilities() {
        if (!navigator.mediaDevices?.enumerateDevices) return;
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            hasMultipleCameras = devices.filter(d => d.kind === 'videoinput').length > 1;
        } catch (err) {
            console.error("카메라 장치 확인 오류:", err);
        }
    }
    checkCameraCapabilities();

    // 결과 표시 함수 (새로운 구조에 맞게 수정)
    function showPredictionResult(message, type = 'info') {
        predictionResultDiv.textContent = message;
        // 타입에 따른 클래스 변경은 style.css에 이미 정의되어 있으므로 생략 가능
        // 필요하다면 추가: predictionResultDiv.className = `result-box ${type}`;
        predictionResultDiv.style.display = 'block';
    }

    // 이미지 판별 요청
    async function sendImageForPrediction(fileBlob) {
        showPredictionResult('판별 중... 이미지를 분석하고 있습니다.', 'loading');
        animalInfoContainer.style.display = 'none';

        const formData = new FormData();
        formData.append('image', fileBlob, 'image.jpg');

        try {
            const response = await fetch('/predict', { method: 'POST', body: formData });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: '서버 응답 오류' }));
                throw new Error(errorData.error);
            }
            const data = await response.json();
            showPredictionResult(data.message);

            const match = data.message.match(/이것은 (.*?)입니다/);
            if (match && match[1]) {
                const animalName = match[1].trim();
                if (animalInfo[animalName]) {
                    const info = animalInfo[animalName];
                    animalSimpleDesc.textContent = info.summary || "간단한 설명이 없습니다.";
                    animalDetailedInfo.innerHTML = info.detail || "<p>상세 정보가 없습니다.</p>";
                    animalInfoContainer.style.display = 'block';
                    animalDetailedInfo.style.display = 'none';
                    toggleDetailedInfoBtn.textContent = '상세 정보 보기';
                }
            }
        } catch (error) {
            showPredictionResult(`오류: ${error.message}`);
        }
    }

    // 카메라 시작
    async function startCamera(facingMode) {
        if (stream) stream.getTracks().forEach(track => track.stop());
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
            cameraPreview.srcObject = stream;
            cameraPreviewContainer.style.display = 'block';
            startCameraBtn.style.display = 'none'; // '촬영하기' 버튼 숨기기
            goToQuizBtn.style.display = 'none'; // '퀴즈' 버튼 숨기기
            document.querySelector('.upload').style.display = 'none'; // '업로드' 버튼 숨기기
            currentFacingMode = facingMode;
        } catch (err) {
            alert('카메라를 시작할 수 없습니다: ' + err.message);
        }
    }

    // 카메라 정지
    function stopCameraStream() {
        if (stream) stream.getTracks().forEach(track => track.stop());
        stream = null;
        cameraPreviewContainer.style.display = 'none';
        startCameraBtn.style.display = 'inline-block';
        goToQuizBtn.style.display = 'inline-block';
        document.querySelector('.upload').style.display = 'inline-block';
    }

    // --- 이벤트 리스너 ---

    // 파일 업로드
    imageFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            sendImageForPrediction(file);
        }
    });

    // 카메라 켜기
    startCameraBtn.addEventListener('click', () => {
        startCamera(hasMultipleCameras ? 'environment' : 'user');
    });

    // 카메라 끄기
    stopCameraBtn.addEventListener('click', stopCameraStream);

    // 카메라 전환
    switchCameraBtn.addEventListener('click', () => {
        currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
        startCamera(currentFacingMode);
    });

    // 사진 찍기
    captureBtn.addEventListener('click', () => {
        if (!stream) return;
        const context = captureCanvas.getContext('2d');
        captureCanvas.width = cameraPreview.videoWidth;
        captureCanvas.height = cameraPreview.videoHeight;
        context.drawImage(cameraPreview, 0, 0);
        stopCameraStream(); // 촬영 후 카메라 UI 닫기
        captureCanvas.toBlob(sendImageForPrediction, 'image/jpeg');
    });

    // 상세 정보 토글
    toggleDetailedInfoBtn.addEventListener('click', () => {
        const isHidden = animalDetailedInfo.style.display === 'none';
        animalDetailedInfo.style.display = isHidden ? 'block' : 'none';
        toggleDetailedInfoBtn.textContent = isHidden ? '상세 정보 숨기기' : '상세 정보 보기';
    });
});