// public/js/quiz.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM이 로드되었습니다. quiz.js 시작!");

    const quizImage = document.getElementById('quizImage');
    const optionsContainer = document.getElementById('optionsContainer');
    const nextQuizBtn = document.getElementById('nextQuizBtn');
    const quizResultDiv = document.getElementById('quizResult');

    const quizScoreDiv = document.createElement('div');
    quizScoreDiv.id = 'quizScore';
    quizScoreDiv.style.marginTop = '10px';
    quizScoreDiv.style.fontSize = '1.1em';
    quizScoreDiv.style.fontWeight = 'bold';
    quizScoreDiv.style.color = '#3498db';
    if(quizResultDiv && quizResultDiv.parentNode) {
        quizResultDiv.parentNode.insertBefore(quizScoreDiv, quizResultDiv);
    } else {
        console.error("quizResultDiv 또는 그 부모를 찾을 수 없습니다.");
    }


    const restartQuizBtn = document.createElement('button');
    restartQuizBtn.id = 'restartQuizBtn';
    restartQuizBtn.textContent = '퀴즈 다시 시작';
    restartQuizBtn.className = 'secondary-button';
    restartQuizBtn.style.marginTop = '20px';
    restartQuizBtn.style.display = 'none';
    if (nextQuizBtn && nextQuizBtn.parentNode) {
        nextQuizBtn.parentNode.insertBefore(restartQuizBtn, nextQuizBtn.nextSibling);
    } else {
        console.error("nextQuizBtn 또는 그 부모를 찾을 수 없습니다.");
    }


    const quizImages = [
        { src: 'quiz_images/m1.jpg', answer: '미어캣', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/m2.jpg', answer: '미어캣', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/m3.png', answer: '미어캣', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/m4.jpg', answer: '미어캣', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/m5.jpg', answer: '미어캣', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/m6.png', answer: '미어캣', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/mo1.jpg', answer: '몽구스', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/mo2.jpg', answer: '몽구스', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/mo3.jpg', answer: '몽구스', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/mo4.jpg', answer: '몽구스', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/mo5.jpg', answer: '몽구스', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/t1.jpg', answer: '머선거북이', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/t2.jpg', answer: '머선거북이', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/t3.jpg', answer: '머선거북이', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/t4.jpg', answer: '머선거북이', options: ['미어캣', '머선거북이', '몽구스',] },
        { src: 'quiz_images/t5.jpg', answer: '머선거북이', options: ['미어캣', '머선거북이', '몽구스',] },
    ];

    const TOTAL_QUIZ_QUESTIONS = 5;
    let currentQuestionNumber = 0;
    let correctAnswersCount = 0;
    let quizQuestionPool = [];


    function startQuiz() {
        console.log("퀴즈 시작 (startQuiz)");
        currentQuestionNumber = 0;
        correctAnswersCount = 0;
        quizScoreDiv.textContent = '';
        restartQuizBtn.style.display = 'none';

        optionsContainer.style.display = 'block';
        nextQuizBtn.style.display = 'inline-block';
        nextQuizBtn.textContent = '다음 문제';
        nextQuizBtn.classList.remove('secondary-button');
        nextQuizBtn.classList.add('primary-button');
        nextQuizBtn.disabled = true; // 처음에는 비활성화

        quizQuestionPool = shuffleArray([...quizImages]).slice(0, TOTAL_QUIZ_QUESTIONS);
        if (quizQuestionPool.length < TOTAL_QUIZ_QUESTIONS) {
            console.warn("주의: 퀴즈 이미지 수가 총 문제 수보다 적습니다.");
        }
        console.log("선택된 문제 풀:", quizQuestionPool);
        
        loadNextQuestion();
    }

    function loadNextQuestion() {
        console.log(`다음 문제 로드 (loadNextQuestion), 현재 문제 번호 (증가 전): ${currentQuestionNumber}`);
        if (currentQuestionNumber >= TOTAL_QUIZ_QUESTIONS) {
            console.log("퀴즈 종료 조건 충족 (loadNextQuestion)");
            endQuiz();
            return;
        }

        currentQuestionNumber++;
        console.log(`현재 문제 번호 (증가 후): ${currentQuestionNumber}`);

        // 문제 풀에 문제가 있는지 확인
        if (!quizQuestionPool || quizQuestionPool.length < currentQuestionNumber) {
            console.error("퀴즈 문제 풀에 문제가 없습니다. (loadNextQuestion)");
            endQuiz(); // 문제가 없으면 퀴즈 종료
            return;
        }

        const quizData = quizQuestionPool[currentQuestionNumber - 1];
        console.log("현재 문제 데이터:", quizData);

        quizImage.style.display = 'none';
        quizResultDiv.textContent = `문제 ${currentQuestionNumber}/${TOTAL_QUIZ_QUESTIONS}`;
        quizResultDiv.style.color = '#333';
        quizScoreDiv.textContent = `현재 점수: ${correctAnswersCount} / ${currentQuestionNumber - 1}`;
        
        optionsContainer.innerHTML = '';
        shuffleArray([...quizData.options]).forEach(optionText => { // 원본 options 배열을 변경하지 않기 위해 복사 후 셔플
            const optionBtn = document.createElement('button');
            optionBtn.textContent = optionText;
            optionBtn.className = 'quiz-option-button';
            optionBtn.addEventListener('click', () => handleOptionClick(optionText, quizData.answer));
            optionsContainer.appendChild(optionBtn);
        });

        // '다음 문제' 버튼은 사용자가 답변을 선택할 때까지 비활성화 상태로 유지
        nextQuizBtn.disabled = true;
        console.log("nextQuizBtn 비활성화됨 (loadNextQuestion)");


        quizImage.src = quizData.src;
        quizImage.alt = `퀴즈 이미지: ${quizData.answer}`; // alt 속성 추가
        quizImage.onload = () => { // 이미지가 완전히 로드된 후 표시
            quizImage.style.display = 'block';
            console.log("퀴즈 이미지 로드 완료 및 표시됨");
        };
        quizImage.onerror = () => {
            console.error(`이미지 로드 실패: ${quizData.src}`);
            quizResultDiv.textContent = '이미지를 로드할 수 없습니다.';
            quizResultDiv.style.color = 'red';
        };
    }

    function handleOptionClick(selectedAnswer, correctAnswer) {
        console.log(`선택지 클릭됨: 선택한 답 - ${selectedAnswer}, 정답 - ${correctAnswer}`);

        Array.from(optionsContainer.children).forEach(btn => {
            btn.disabled = true;
            if (btn.textContent.toLowerCase() === correctAnswer.toLowerCase()) {
                btn.style.backgroundColor = 'green';
                btn.style.color = 'white';
            } else if (btn.textContent.toLowerCase() === selectedAnswer.toLowerCase()) {
                btn.style.backgroundColor = 'red';
                btn.style.color = 'white';
            }
        });

        if (selectedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            quizResultDiv.textContent = `정답! 이 동물은 ${correctAnswer}입니다.`;
            quizResultDiv.style.color = 'green';
            correctAnswersCount++;
        } else {
            quizResultDiv.textContent = `오답! 정답은 ${correctAnswer}입니다.`;
            quizResultDiv.style.color = 'red';
        }
        quizScoreDiv.textContent = `현재 점수: ${correctAnswersCount} / ${currentQuestionNumber}`;

        // '다음 문제' 버튼 활성화
        nextQuizBtn.disabled = false;
        console.log("nextQuizBtn 활성화됨 (handleOptionClick)");

        if (currentQuestionNumber === TOTAL_QUIZ_QUESTIONS) {
            nextQuizBtn.textContent = '퀴즈 종료';
            nextQuizBtn.classList.remove('primary-button');
            nextQuizBtn.classList.add('secondary-button');
        } else {
            nextQuizBtn.textContent = '다음 문제';
            nextQuizBtn.classList.remove('secondary-button');
            nextQuizBtn.classList.add('primary-button');
        }
    }

    function endQuiz() {
        console.log("퀴즈 종료 (endQuiz)");
        quizImage.style.display = 'none';
        optionsContainer.style.display = 'none';
        nextQuizBtn.style.display = 'none';

        quizResultDiv.textContent = `퀴즈 종료! 최종 점수: ${correctAnswersCount} / ${TOTAL_QUIZ_QUESTIONS} 입니다.`;
        quizResultDiv.style.color = '#2c3e50';
        quizScoreDiv.textContent = '';

        restartQuizBtn.style.display = 'block';
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    // --- 페이지 로드 시 퀴즈 시작 ---
    // nextQuizBtn 이벤트 리스너는 여기에 위치하는 것이 더 안전합니다.
    if (nextQuizBtn) {
        nextQuizBtn.addEventListener('click', () => {
            console.log("'다음 문제' 버튼 클릭됨");
            loadNextQuestion();
        });
    } else {
        console.error("nextQuizBtn 요소를 찾을 수 없습니다.");
    }

    if (restartQuizBtn) {
        restartQuizBtn.addEventListener('click', () => {
            console.log("'퀴즈 다시 시작' 버튼 클릭됨");
            optionsContainer.style.display = 'block';
            nextQuizBtn.style.display = 'inline-block';
            
            startQuiz();
        });
    } else {
        console.error("restartQuizBtn 요소를 찾을 수 없습니다.");
    }

    startQuiz(); // 퀴즈 시작
});