const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
require('dotenv').config(); // .env 파일에서 환경 변수 로드

const app = express();
const port = process.env.PORT || 3000; // 웹 앱이 실행될 포트 번호. Azure 환경 변수 PORT를 사용하거나, 없으면 3000 사용

// 환경 변수에서 API 키와 엔드포인트 로드
const PREDICTION_KEY = process.env.CUSTOM_VISION_PREDICTION_KEY;
const PREDICTION_ENDPOINT = process.env.CUSTOM_VISION_PREDICTION_ENDPOINT;

// Custom Vision API 정보가 제대로 로드되었는지 확인
if (!PREDICTION_KEY || !PREDICTION_ENDPOINT) {
    console.error("환경 변수 (CUSTOM_VISION_PREDICTION_KEY, CUSTOM_VISION_PREDICTION_ENDPOINT)가 설정되지 않았습니다.");
    process.exit(1); // 앱 종료
}

// Multer 설정: 메모리에 이미지 저장 (작은 이미지 파일에 적합)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 정적 파일 (HTML, CSS, JS) 서빙 설정
app.use(express.static(path.join(__dirname, 'public')));

// 루트 경로로 접속 시 index.html 서빙
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 이미지 분류 API 엔드포인트
app.post('/predict', upload.single('image'), async (req, res) => {
    // 'image'는 HTML 폼의 input name="image"와 일치해야 합니다.
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageBuffer = req.file.buffer; // 업로드된 이미지 데이터를 버퍼로 가져옴
    const imageMimeType = req.file.mimetype; // <--- 새로 추가된 부분: 업로드된 파일의 MIME 타입 가져오기

    try {
        const response = await axios.post(PREDICTION_ENDPOINT, imageBuffer, {
            headers: {
                'Prediction-Key': PREDICTION_KEY,
                'Content-Type': imageMimeType // <--- 수정된 부분: 가져온 MIME 타입으로 Content-Type 설정
            }
        });

        const result = response.data;
        const predictions = result.predictions || [];

        if (predictions.length > 0) {
            // 가장 확률이 높은 예측 결과 추출
            const bestPrediction = predictions.reduce((prev, current) =>
                (prev.probability > current.probability) ? prev : current
            );
            const tagName = bestPrediction.tagName;
            const probability = (bestPrediction.probability * 100).toFixed(2); // 백분율

            let message = '';
            if (parseFloat(probability) >= 70) { // 70% 이상의 확률일 경우만 판별
                message = `이것은 ${tagName}입니다. (확률: ${probability}%)`;
            } else {
                message = `판별하기 어렵습니다. (가장 높은 확률: ${tagName}, ${probability}%)`;
            }

            return res.json({ message: message, predictions: predictions });
        } else {
            return res.status(500).json({ error: 'No predictions found from Custom Vision API' });
        }

    } catch (error) {
        // <--- 수정된 부분: 에러 상세 정보 추가
        console.error("Error calling Custom Vision API:", error.response ? error.response.data : error.message);
        const errorMessage = error.response && error.response.data ? JSON.stringify(error.response.data) : error.message;
        return res.status(500).json({ error: `API request failed: ${errorMessage}` });
    }
});

// 서버 시작
app.listen(port, () => {
    console.log(`Dog-Cat AI Web App listening at http://localhost:${port}`);
});