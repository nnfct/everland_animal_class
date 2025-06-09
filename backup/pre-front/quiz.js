// public/js/quiz.js (최종 수정본)

document.addEventListener('DOMContentLoaded', async () => {
    console.log("퀴즈 페이지 로드 완료");

    // --- DOM 요소 가져오기 ---
    const quizImage = document.getElementById('quizImage');
    const optionsContainer = document.getElementById('optionsContainer');
    const nextQuizBtn = document.getElementById('nextQuizBtn');
    const quizResultDiv = document.getElementById('quizResult');
    const quizSection = document.getElementById('quizSection'); // 점수 표시를 위해

    let animalData = {};
    let animalKeys = [];
    let answerChecked = false;
    
    // --- 퀴즈 상태 변수 ---
    const TOTAL_QUESTIONS = 5;
    let quizPool = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // 점수판 생성 및 삽입
    const scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'scoreDisplay';
    scoreDisplay.style.fontSize = '1.2em';
    scoreDisplay.style.fontWeight = 'bold';
    scoreDisplay.style.margin = '1rem 0';
    quizSection.insertBefore(scoreDisplay, nextQuizBtn);

    // 1. 동물 데이터 로드
    async function loadAnimalData() {
        try {
            const response = await fetch('js/animaldata.json');
            if (!response.ok) throw new Error('퀴즈 데이터 로드 실패');
            animalData = await response.json();
            animalKeys = Object.keys(animalData).filter(key => animalData[key].image); // 이미지가 있는 동물만
            if (animalKeys.length < 4) {
                 quizResultDiv.textContent = "퀴즈를 만들기에 동물이 부족해요!";
                 return;
            }
            startQuiz();
        } catch (error) {
            console.error(error);
            quizResultDiv.textContent = "퀴즈 데이터를 불러오는 데 실패했습니다.";
        }
    }

    // 2. 퀴즈 시작
    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        // 전체 동물 목록에서 랜덤하게 5문제 추출
        quizPool = shuffleArray([...animalKeys]).slice(0, TOTAL_QUESTIONS);
        nextQuizBtn.textContent = "다음 문제";
        nextQuizBtn.disabled = true;
        displayQuestion();
    }

    // 3. 문제 표시
    function displayQuestion() {
        answerChecked = false;
        optionsContainer.innerHTML = '';
        quizResultDiv.textContent = '';
        scoreDisplay.textContent = `문제 ${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS} | 점수: ${score}`;

        const answerKey = quizPool[currentQuestionIndex];
        const answerInfo = animalData[answerKey];

        quizImage.src = answerInfo.image;
        quizImage.alt = answerInfo.name_en || "퀴즈 이미지";
        quizImage.style.display = 'block';

        const wrongOptionKeys = [];
        while (wrongOptionKeys.length < 3) {
            const randomKey = animalKeys[Math.floor(Math.random() * animalKeys.length)];
            if (randomKey !== answerKey && !wrongOptionKeys.includes(randomKey)) {
                wrongOptionKeys.push(randomKey);
            }
        }

        const optionKeys = shuffleArray([answerKey, ...wrongOptionKeys]);

        optionKeys.forEach(key => {
            const button = document.createElement('button');
            // ✨ --- 핵심 수정: 올바른 클래스 이름 적용 --- ✨
            button.className = 'button quiz-option'; 
            button.textContent = key.split('(')[0];
            button.onclick = () => checkAnswer(key, answerKey);
            optionsContainer.appendChild(button);
        });

        nextQuizBtn.disabled = true;
    }

    // 4. 정답 확인
    function checkAnswer(selectedKey, answerKey) {
        if (answerChecked) return;
        answerChecked = true;
        nextQuizBtn.disabled = false;

        if (selectedKey === answerKey) {
            score++;
            quizResultDiv.textContent = "🎉 정답입니다! 🎉";
            quizResultDiv.style.color = 'green';
        } else {
            quizResultDiv.textContent = `😢 아쉬워요! 정답은 ${answerKey.split('(')[0]} 입니다.`;
            quizResultDiv.style.color = 'red';
        }
        
        // 버튼 스타일 업데이트
        Array.from(optionsContainer.children).forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === answerKey.split('(')[0]) {
                btn.classList.add('correct');
            } else if (btn.textContent === selectedKey.split('(')[0]) {
                btn.classList.add('wrong');
            }
        });
        
        scoreDisplay.textContent = `문제 ${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS} | 점수: ${score}`;

        if (currentQuestionIndex === TOTAL_QUESTIONS - 1) {
            nextQuizBtn.textContent = "결과 보기";
        }
    }

    // 다음 문제 버튼 클릭 핸들러
    nextQuizBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < TOTAL_QUESTIONS) {
            displayQuestion();
        } else {
            showFinalResult();
        }
    });

    // 최종 결과 표시
    function showFinalResult() {
        quizImage.style.display = 'none';
        optionsContainer.innerHTML = '';
        nextQuizBtn.style.display = 'none';
        scoreDisplay.style.display = 'none';
        quizResultDiv.innerHTML = `퀴즈 종료!<br>최종 점수는 <strong>${score} / ${TOTAL_QUESTIONS}</strong> 입니다!`;

        // 다시하기 버튼 추가
        const restartBtn = document.createElement('button');
        restartBtn.className = 'button quiz';
        restartBtn.textContent = '퀴즈 다시하기';
        restartBtn.onclick = () => location.reload(); // 페이지 새로고침으로 간단히 구현
        quizResultDiv.parentNode.insertBefore(restartBtn, quizResultDiv.nextSibling);
    }
    
    // 배열 셔플 함수
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 퀴즈 시작
    loadAnimalData();
});