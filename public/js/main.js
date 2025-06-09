// public/js/main.js

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM 로드 완료, main.js 초기화 시작");

    // --- DOM 요소 가져오기 ---
    const imageFile = document.getElementById('imageFile');
    const startCameraBtn = document.getElementById('startCameraBtn');
    const goToQuizBtn = document.getElementById('goToQuizBtn');
    const uploadBtn = document.querySelector('.button.upload');
    const cameraPreviewContainer = document.getElementById('cameraPreviewContainer');
    const cameraPreview = document.getElementById('cameraPreview');
    const captureCanvas = document.getElementById('captureCanvas');
    const captureBtn = document.getElementById('captureBtn');
    const stopCameraBtn = document.getElementById('stopCameraBtn');
    const imagePreviewBox = document.getElementById('imagePreviewBox');
    const uploadedImagePreview = document.getElementById('uploadedImagePreview');
    const predictionResultDiv = document.getElementById('predictionResult');
    const animalInfoContainer = document.getElementById('animalInfoContainer');
    const animalSimpleDesc = document.getElementById('animalSimpleDesc');
    const toggleDetailedInfoBtn = document.getElementById('toggleDetailedInfoBtn');
    const animalDetailedInfo = document.getElementById('animalDetailedInfo');

    const switchCameraBtn = document.createElement('button');
    switchCameraBtn.id = 'switchCameraBtn';
    switchCameraBtn.textContent = '카메라 전환';
    switchCameraBtn.className = 'button secondary';
    captureBtn.parentNode.insertBefore(switchCameraBtn, captureBtn);

    // --- 상태 변수 ---
    let stream = null;
    let currentFacingMode = 'user';
    let hasMultipleCameras = false;
    let animalInfo = {};
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // --- 기능 함수들 ---

    async function loadAnimalData() {
        try {
            const response = await fetch('js/animaldata.json');
            if (!response.ok) throw new Error('동물 정보 로드 실패');
            animalInfo = await response.json();
            console.log("동물 정보 로드 완료");
        } catch (error) {
            console.error(error);
            showPredictionResult("정보 로드에 실패했습니다. 새로고침 해주세요.");
        }
    }
    await loadAnimalData();

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

    function showPredictionResult(message) {
        predictionResultDiv.textContent = message;
        predictionResultDiv.style.display = 'block';
    }

    // main.js 파일의 sendImageForPrediction 함수만 아래 내용으로 교체

    async function sendImageForPrediction(fileBlob) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImagePreview.src = e.target.result;
            imagePreviewBox.style.display = 'block';
        };
        reader.readAsDataURL(fileBlob);
        
        showPredictionResult('판별 중... 잠시만 기다려주세요...');
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
            const predictions = data.predictions || [];

            if (predictions.length === 0) {
                 showPredictionResult('아무것도 찾지 못했어요. 다른 사진으로 시도해보세요.');
                 return;
            }

            const bestPrediction = predictions.reduce((prev, current) => 
                (prev.probability > current.probability) ? prev : current
            );
            
            // ✨ --- 여기가 최종 수정된 부분입니다 --- ✨
            
            const tagNameFromAI = bestPrediction.tagName; // 예: "미어캣(Meerkat)"
            const probability = (bestPrediction.probability * 100).toFixed(2);
            
            console.log(`[디버깅] AI 예측 태그(키): "${tagNameFromAI}", 확률: ${probability}%`);

            // AI가 반환한 tagName이 우리 데이터의 키(key) 중에 직접 존재하는지 확인
            const foundAnimalInfo = animalInfo[tagNameFromAI];
            
            if (foundAnimalInfo) {
                 console.log(`[디버깅] ✅ 일치! 키: ${tagNameFromAI}`);
            } else {
                 console.error(`[디버깅] ❌ animalInfo 객체에 "${tagNameFromAI}" 키가 없습니다.`);
            }


            // 결과 표시 로직
            if (foundAnimalInfo && parseFloat(probability) >= 70) {
                const koreanName = tagNameFromAI.split('(')[0];
                const message = `이 동물은 ${koreanName} 같아요! (정확도: ${probability}%)`;
                showPredictionResult(message);

                animalSimpleDesc.textContent = foundAnimalInfo.summary || "간단한 설명이 없습니다.";
                animalDetailedInfo.innerHTML = foundAnimalInfo.detail || "<p>상세 정보가 없습니다.</p>";
                animalInfoContainer.style.display = 'block';
                animalDetailedInfo.style.display = 'none';
                toggleDetailedInfoBtn.textContent = '상세 정보 보기';
            } else {
                // foundAnimalInfo가 있더라도 확률이 낮으면 여기로 옴
                const closestAnimalName = tagNameFromAI.split('(')[0];
                const message = `판별하기 어려워요. (가장 비슷한 동물: ${closestAnimalName}, ${probability}%)`;
                showPredictionResult(message);
                animalInfoContainer.style.display = 'none';
            }
        } catch (error) {
            showPredictionResult(`오류가 발생했어요: ${error.message}`);
        }
    }
    
    // 카메라 시작 함수
    async function startCamera(facingMode) {
        if (stream) stream.getTracks().forEach(track => track.stop());
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
            cameraPreview.srcObject = stream;
            
            cameraPreviewContainer.style.display = 'block';
            startCameraBtn.style.display = 'none';
            goToQuizBtn.style.display = 'none';
            uploadBtn.style.display = 'none';
            currentFacingMode = facingMode;

            if (isTouchDevice) {
                requestAnimationFrame(() => {
                    cameraPreviewContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            }
        } catch (err) {
            alert('카메라를 시작할 수 없습니다: ' + err.message);
            stopCameraStream();
        }
    }

    // 카메라 정지 함수
    function stopCameraStream() {
        if (stream) stream.getTracks().forEach(track => track.stop());
        stream = null;
        cameraPreviewContainer.style.display = 'none';
        startCameraBtn.style.display = 'inline-block';
        goToQuizBtn.style.display = 'inline-block';
        uploadBtn.style.display = 'inline-block';
    }

    // --- 이벤트 리스너 ---

    imageFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            requestAnimationFrame(() => {
                predictionResultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
            sendImageForPrediction(file);
        }
    });

    startCameraBtn.addEventListener('click', () => {
        startCamera(hasMultipleCameras ? 'environment' : 'user');
    });

    stopCameraBtn.addEventListener('click', stopCameraStream);

    switchCameraBtn.addEventListener('click', () => {
        if (!stream) return;
        currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
        startCamera(currentFacingMode);
    });

    captureBtn.addEventListener('click', () => {
        if (!stream) return;
        const context = captureCanvas.getContext('2d');
        captureCanvas.width = cameraPreview.videoWidth;
        captureCanvas.height = cameraPreview.videoHeight;
        context.drawImage(cameraPreview, 0, 0);
        stopCameraStream();
        
        requestAnimationFrame(() => {
            predictionResultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        captureCanvas.toBlob(sendImageForPrediction, 'image/jpeg');
    });

    toggleDetailedInfoBtn.addEventListener('click', () => {
        const isHidden = animalDetailedInfo.style.display === 'none';
        animalDetailedInfo.style.display = isHidden ? 'block' : 'none';
        toggleDetailedInfoBtn.textContent = isHidden ? '상세 정보 숨기기' : '상세 정보 보기';
    });
});