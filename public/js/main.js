// public/js/main.js (최종 수정본)

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM 로드 완료, main.js 초기화 시작");
      

    // --- DOM 요소 가져오기 ---
    const imageFile = document.getElementById('imageFile');
    const startCameraBtn = document.getElementById('startCameraBtn');
    const goToQuizBtn = document.getElementById('goToQuizBtn');
    const uploadBtn = document.querySelector('.button.upload');
    const mainButtonGroup = document.querySelector('.button-group'); // ✨ 메인 버튼 그룹을 변수로 관리
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
    const backToMainFromPreviewBtn = document.getElementById('backToMainFromPreviewBtn'); 
    const uploadIcon = document.getElementById('uploadIcon');
    const cameraIcon = document.getElementById('cameraIcon');
    const quizIcon = document.getElementById('quizIcon');

    const switchCameraBtn = document.createElement('button');
    switchCameraBtn.id = 'switchCameraBtn';
    switchCameraBtn.textContent = '카메라 전환';
    switchCameraBtn.className = 'button secondary';
    captureBtn.parentNode.insertBefore(switchCameraBtn, captureBtn);

    // --- 상태 변수 및 초기 함수들 (이전과 동일) ---
    let stream = null;
    let currentFacingMode = 'user';
    let hasMultipleCameras = false;
    
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    // main.js 파일에서 이 함수 전체를 교체하세요.


    

    async function checkCameraCapabilities() { /* ... 이전과 동일 ... */ }
    checkCameraCapabilities();

    // ✨ --- UI 상태 관리 함수들 --- ✨

    // UI를 초기 메인 화면으로 리셋하는 함수
    function resetToMainMenu() {
        // 모든 결과 및 카메라 UI 숨기기
        imagePreviewBox.style.display = 'none';
        predictionResultDiv.style.display = 'none';
        animalInfoContainer.style.display = 'none';
        cameraPreviewContainer.style.display = 'none';
        backToMainFromPreviewBtn.style.display = 'none';
        
        // 메인 버튼 그룹 보이기
        mainButtonGroup.style.display = 'flex';
    }
    
    // UI를 판별/미리보기 상태로 변경하는 함수
    function showPreviewState() {
        // 메인 버튼 그룹과 카메라 UI 숨기기
        mainButtonGroup.style.display = 'none';
        cameraPreviewContainer.style.display = 'none';

        // 미리보기 및 결과 영역 보이기 (내용은 다른 함수에서 채움)
        imagePreviewBox.style.display = 'block';
        predictionResultDiv.style.display = 'block';
        backToMainFromPreviewBtn.style.display = 'block';
    }

    function showPredictionResult(message) {
        predictionResultDiv.textContent = message;
    }

    // --- 핵심 로직 함수들 ---

    async function handleFile(file) {
        if (!file) return;
        showPreviewState(); // ✨ UI를 미리보기 상태로 변경
        
        const options = { maxSizeMB: 2, maxWidthOrHeight: 1920, useWebWorker: true };
        try {
            const compressedFile = await imageCompression(file, options);
            displayPreviewAndPredict(compressedFile);
        } catch (error) {
            console.error('이미지 처리 오류, 원본 파일로 시도:', error);
            displayPreviewAndPredict(file);
        }
    }

    function displayPreviewAndPredict(fileObject) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImagePreview.src = e.target.result;
        };
        reader.readAsDataURL(fileObject);
        
        requestAnimationFrame(() => {
            predictionResultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        
        sendImageForPrediction(fileObject);
    }
    
    
    async function sendImageForPrediction(fileObject) {
    // 1. "판별 중..." 메시지 표시
    showPredictionResult('판별 중... 이미지를 분석하고 있습니다.');
    animalInfoContainer.style.display = 'none'; // 이전 정보 숨기기

    const formData = new FormData();
    formData.append('image', fileObject);

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`서버 오류: ${response.status} (${errorText})`);
        }

        const data = await response.json();

        // 2. 서버 응답에 따라 결과 표시
        showPredictionResult(data.message);

        // 3. 성공적으로 동물을 판별한 경우, 추가 정보 표시
        if (data.animal_name && data.animal_info) {
            const info = data.animal_info 
            
            // 간단 설명 채우기
            animalSimpleDesc.textContent = info.summary;

            // 상세 설명 (ul, li) 동적으로 생성 및 채우기
            animalDetailedInfo.innerHTML = info.detail;
            
            // 정보 컨테이너 보이기
            animalInfoContainer.style.display = 'block';
            animalDetailedInfo.style.display = 'none'; // 상세 정보는 일단 숨김
            toggleDetailedInfoBtn.textContent = '상세 정보 보기';
            
        } else {
            // 판별 실패 시 정보 컨테이너 숨기기
            animalInfoContainer.style.display = 'none';
        }

    } catch (error) {
        console.error('판별 요청 오류:', error);
        showPredictionResult(`오류가 발생했습니다: ${error.message}`);
        animalInfoContainer.style.display = 'none';
    }
} 

    async function startCamera(facingMode) {
        if (stream) stream.getTracks().forEach(track => track.stop());
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
            cameraPreview.srcObject = stream;
            
            mainButtonGroup.style.display = 'none'; // 메인 버튼 숨기기
            cameraPreviewContainer.style.display = 'block'; // 카메라 보이기
            currentFacingMode = facingMode;

            if (isTouchDevice) {
                requestAnimationFrame(() => {
                    cameraPreviewContainer.scrollIntoView({block: 'start' });
                });
            }
        } catch (err) {
            alert('카메라를 시작할 수 없습니다: ' + err.message);
            resetToMainMenu(); // 실패 시 메인으로 복구
        }
    }

    function stopCameraStream() {
        if (stream) stream.getTracks().forEach(track => track.stop());
        stream = null;
        resetToMainMenu(); // '카메라 끄기'는 항상 메인으로 복귀
    }

    // --- 이벤트 리스너 ---

    imageFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        handleFile(file);
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
        
        if (currentFacingMode === 'user') {
            context.save();
            context.scale(-1, 1);
            context.drawImage(cameraPreview, -captureCanvas.width, 0, captureCanvas.width, captureCanvas.height);
            context.restore();
        } else {
            context.drawImage(cameraPreview, 0, 0, captureCanvas.width, captureCanvas.height);
        }
        
        // ✨ 스트림만 정지하고 UI는 숨기기만 함
        if (stream) stream.getTracks().forEach(track => track.stop());
        stream = null;

        captureCanvas.toBlob((blob) => {
            if (!blob) return;
            const capturedFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
            handleFile(capturedFile);
        }, 'image/jpeg', 0.9);
    });

    toggleDetailedInfoBtn.addEventListener('click', () => {
    const isHidden = animalDetailedInfo.style.display === 'none';

    if (isHidden) {
        // 상세 정보가 숨겨져 있으면 보여주기
        animalDetailedInfo.style.display = 'block';
        toggleDetailedInfoBtn.textContent = '상세 정보 닫기';
    } else {
        // 상세 정보가 보이고 있으면 숨기기
        animalDetailedInfo.style.display = 'none';
        toggleDetailedInfoBtn.textContent = '상세 정보 보기';
    }
});
    

    // ✨ 새로 추가한 '메인으로 돌아가기' 버튼 이벤트 리스너
    backToMainFromPreviewBtn.addEventListener('click', resetToMainMenu);


        // '이미지 업로드' 아이콘 클릭 시
    uploadIcon.addEventListener('click', () => {
        // 숨겨진 파일 입력창을 클릭하여 파일 선택창을 엽니다.
        imageFile.click();
    });

    // '촬영하기' 아이콘 클릭 시
    cameraIcon.addEventListener('click', () => {
        // '촬영하기' 버튼을 클릭한 것과 동일한 동작을 수행합니다.
        startCameraBtn.click();
    });

    // '퀴즈 풀러가기' 아이콘 클릭 시
    quizIcon.addEventListener('click', () => {
        // 퀴즈 페이지로 이동합니다.
        location.href = 'quiz.html';
    });

}); // DOMContentLoaded 이벤트 리스너 닫는 부분