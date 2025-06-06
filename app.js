const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const PREDICTION_KEY = process.env.CUSTOM_VISION_PREDICTION_KEY;
const PREDICTION_ENDPOINT = process.env.CUSTOM_VISION_PREDICTION_ENDPOINT;

if (!PREDICTION_KEY || !PREDICTION_ENDPOINT) {
    console.error("환경 변수 (CUSTOM_VISION_PREDICTION_KEY, CUSTOM_VISION_PREDICTION_ENDPOINT)가 설정되지 않았습니다.");
    process.exit(1);
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/predict', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageBuffer = req.file.buffer;
    // const imageMimeType = req.file.mimetype; // 이 줄은 이제 사용하지 않습니다.

    try {
        const response = await axios.post(PREDICTION_ENDPOINT, imageBuffer, {
            headers: {
                'Prediction-Key': PREDICTION_KEY,
                'Content-Type': 'application/octet-stream' // <--- 이 MIME 타입으로 고정합니다.
            }
        });

        const result = response.data;
        const predictions = result.predictions || [];

        if (predictions.length > 0) {
            const bestPrediction = predictions.reduce((prev, current) =>
                (prev.probability > current.probability) ? prev : current
            );
            const tagName = bestPrediction.tagName;
            const probability = (bestPrediction.probability * 100).toFixed(2);

            let message = '';
            if (parseFloat(probability) >= 70) {
                message = `이것은 ${tagName}입니다. (확률: ${probability}%)`;
            } else {
                message = `판별하기 어렵습니다. (가장 높은 확률: ${tagName}, ${probability}%)`;
            }

            return res.json({ message: message, predictions: predictions });
        } else {
            return res.status(500).json({ error: 'No predictions found from Custom Vision API' });
        }

    } catch (error) {
        console.error("Error calling Custom Vision API:", error.response ? error.response.data : error.message);
        const errorMessage = error.response && error.response.data ? JSON.stringify(error.response.data) : error.message;
        return res.status(500).json({ error: `API request failed: ${errorMessage}` });
    }
});

app.listen(port, () => {
    console.log(`Dog-Cat AI Web App listening at http://localhost:${port}`);
});