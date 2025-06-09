// app.js (최종 수정본)

// 1. 필요한 모든 모듈을 파일 최상단에서 불러옵니다. (순서 중요)
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// 2. Express 앱을 초기화합니다.
const app = express();
const port = process.env.PORT || 3000;

// 3. 환경 변수를 체크합니다.
const PREDICTION_KEY = process.env.CUSTOM_VISION_PREDICTION_KEY;
const PREDICTION_ENDPOINT = process.env.CUSTOM_VISION_PREDICTION_ENDPOINT;

if (!PREDICTION_KEY || !PREDICTION_ENDPOINT) {
    console.error("환경 변수 (CUSTOM_VISION_PREDICTION_KEY, CUSTOM_VISION_PREDICTION_ENDPOINT)가 설정되지 않았습니다.");
    process.exit(1);
}

// 4. ✨ animaldata.json 파일을 미리 로드하여 전역 변수로 만듭니다. (가장 중요)
//    이렇게 파일 상단에 두어야 아래의 모든 라우트에서 접근 가능합니다.
const animalDataPath = path.join(__dirname, 'public','js', 'animaldata.json');
const animalData = JSON.parse(fs.readFileSync(animalDataPath, 'utf8'));
const animalKeys = Object.keys(animalData); // 이제 animalKeys는 어디서든 사용 가능!


// 5. multer와 static 폴더 등 미들웨어를 설정합니다.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(express.static(path.join(__dirname, 'public')));


// 6. 라우트(경로)를 설정합니다.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/predict', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageBuffer = req.file.buffer;

    try {
        const response = await axios.post(PREDICTION_ENDPOINT, imageBuffer, {
            headers: {
                'Prediction-Key': PREDICTION_KEY,
                'Content-Type': 'application/octet-stream'
            }
        });

        const result = response.data;
        const predictions = result.predictions || [];

        if (predictions.length > 0) {
            const bestPrediction = predictions.reduce((prev, current) =>
                (prev.probability > current.probability) ? prev : current
            );
            
            const tagNameFromAPI = bestPrediction.tagName;
            const probability = (bestPrediction.probability * 100).toFixed(2);

            // 미리 로드해둔 animalKeys를 사용하여 일치하는 키를 찾습니다.
            const matchedKey = animalKeys.find(key => key.trim().toLowerCase() === tagNameFromAPI.trim().toLowerCase());

            let message = '';
            let animal_name_for_client = null;
            let animal_info_for_client = null;
            // 일치하는 키가 있는 경우, 해당 정보를 가져옵니다.

            if (parseFloat(probability) >= 70 && matchedKey) {
                message = `이것은 ${matchedKey}입니다. (확률: ${probability}%)`;
                animal_name_for_client = matchedKey;
                animal_info_for_client = animalData[matchedKey];
            } else {
                message = `판별하기 어렵습니다. (가장 높은 확률: ${tagNameFromAPI}, ${probability}%)`;
            }
            
            return res.json({ 
                message: message, 
                animal_name: animal_name_for_client,
                animal_info: animal_info_for_client,
                predictions: predictions 
            });
        } else {
            return res.status(500).json({ error: 'No predictions found from Custom Vision API' });
        }

    } catch (error) {
        console.error("Error calling Custom Vision API:", error.response ? error.response.data : error.message);
        const errorMessage = error.response && error.response.data ? JSON.stringify(error.response.data) : error.message;
        // ✨ 에러 응답이 matchedKey is not defined가 아니라 실제 에러를 반환하도록 수정
        return res.status(500).json({ error: `API request failed: ${errorMessage}` });
    }
});

// 7. 서버를 실행합니다.
app.listen(port, () => {
    console.log(`Dog-Cat AI Web App listening at http://localhost:${port}`);
});