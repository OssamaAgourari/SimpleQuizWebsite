window.addEventListener('load', function () {
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
    }, 1500);
});
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const landingPage = document.getElementById('landing-page');
    const quizSelection = document.getElementById('quiz-selection');
    const quizPage = document.getElementById('quiz-page');
    const resultsPage = document.getElementById('results-page');
    const startBtn = document.getElementById('start-btn');
    const missionCards = document.querySelectorAll('.mission-card');
    const questionText = document.querySelector('.question-text');
    const optionsContainer = document.querySelector('.options');
    const progressTrail = document.querySelector('.progress-trail');
    const rocket = document.querySelector('.rocket');
    const currentLevel = document.querySelector('.current-level');
    const totalLevels = document.querySelector('.total-levels');
    const timerElement = document.querySelector('.time');
    const planetDisplay = document.querySelector('.planet-display');
    const correctAnswersElement = document.querySelector('.correct-answers');
    const totalQuestionsElement = document.querySelector('.total-questions');
    const timeTakenElement = document.querySelector('.time-taken');
    const starsRating = document.querySelector('.stars-rating');
    const tryAgainBtn = document.querySelector('.try-again');
    const newMissionBtn = document.querySelector('.new-mission');

    // Quiz Variables
    let currentQuiz = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft = 30;
    let startTime;
    let selectedTopic = '';
    let timerInterval;

    // Planet colors for different topics
    const planetColors = {
        html: '#e34c26',
        css: '#2965f1',
        javascript: '#f0db4f'
    };

    // Quiz Data
    const quizData = {
        html: [
            {
                question: "What does HTML stand for?",
                options: [
                    "Hyper Text Markup Language",
                    "Home Tool Markup Language",
                    "Hyperlinks and Text Markup Language",
                    "Hyper Tool Multi Language"
                ],
                answer: 0
            },
            {
                question: "Which HTML element is used for the largest heading?",
                options: ["<heading>", "<h6>", "<h1>", "<head>"],
                answer: 2
            },
            {
                question: "What is the correct HTML element for inserting a line break?",
                options: ["<break>", "<lb>", "<br>", "<linebreak>"],
                answer: 2
            },
            {
                question: "Which HTML attribute is used to define inline styles?",
                options: ["class", "font", "style", "styles"],
                answer: 2
            },
            {
                question: "Which HTML element is used to define the title of a document?",
                options: ["<meta>", "<title>", "<head>", "<header>"],
                answer: 1
            }
        ],
        css: [
            {
                question: "What does CSS stand for?",
                options: [
                    "Computer Style Sheets",
                    "Creative Style Sheets",
                    "Cascading Style Sheets",
                    "Colorful Style Sheets"
                ],
                answer: 2
            },
            {
                question: "Which CSS property is used to change the text color of an element?",
                options: ["text-color", "font-color", "color", "text-style"],
                answer: 2
            },
            {
                question: "Which CSS property controls the text size?",
                options: ["text-size", "font-size", "text-style", "size"],
                answer: 1
            },
            {
                question: "How do you make each word in a text start with a capital letter?",
                options: [
                    "text-transform: capitalize",
                    "text-transform: uppercase",
                    "text-style: capital",
                    "You can't do that with CSS"
                ],
                answer: 0
            },
            {
                question: "Which property is used to change the background color?",
                options: ["color", "bgcolor", "background-color", "bg-color"],
                answer: 2
            }
        ],
        javascript: [
            {
                question: "How do you create a function in JavaScript?",
                options: [
                    "function myFunction()",
                    "function = myFunction()",
                    "function:myFunction()",
                    "create myFunction()"
                ],
                answer: 0
            },
            {
                question: "How do you call a function named 'myFunction'?",
                options: [
                    "call myFunction()",
                    "myFunction()",
                    "call function myFunction()",
                    "execute myFunction()"
                ],
                answer: 1
            },
            {
                question: "How to write an IF statement in JavaScript?",
                options: [
                    "if i = 5 then",
                    "if (i == 5)",
                    "if i == 5 then",
                    "if i = 5"
                ],
                answer: 1
            },
            {
                question: "Which operator is used to assign a value to a variable?",
                options: ["*", "-", "=", "x"],
                answer: 2
            },
            {
                question: "What will the following code return: Boolean(10 > 9)?",
                options: ["true", "false", "NaN", "undefined"],
                answer: 0
            }
        ]
    };

    // Event Listeners
    startBtn.addEventListener('click', showQuizSelection);

    missionCards.forEach(card => {
        card.addEventListener('click', function () {
            selectedTopic = this.getAttribute('data-quiz');
            startQuiz(selectedTopic);
        });
    });

    tryAgainBtn.addEventListener('click', function () {
        if (selectedTopic) {
            startQuiz(selectedTopic);
        }
    });

    newMissionBtn.addEventListener('click', function () {
        quizPage.classList.remove('active');
        resultsPage.classList.remove('active');
        quizSelection.classList.add('active');
    });

    newMissionBtn.addEventListener('click', showQuizSelection);

    // Functions
    function showQuizSelection() {
        landingPage.classList.remove('active');
        quizSelection.classList.add('active');
    }
    function startTimer() {
        clearInterval(timerInterval); // Clear any existing timer
        timeLeft = 30;
        timerElement.textContent = timeLeft;

        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                // Auto move to next question if time runs out
                currentQuestionIndex++;
                if (currentQuestionIndex < currentQuiz.length) {
                    showQuestion();
                    startTimer();
                } else {
                    showResults();
                }
            }
        }, 1000);
    }

    function startQuiz(topic) {
        currentQuiz = [...quizData[topic]];
        currentQuestionIndex = 0;
        score = 0;
        timeLeft = 30;
        clearInterval(timerInterval);

        currentQuiz = [...quizData[topic]];
        currentQuestionIndex = 0;
        score = 0;
        timeLeft = 30;
        selectedTopic = topic;
        startTime = new Date();

        // Set planet color based on topic
        planetDisplay.style.background = `linear-gradient(135deg, ${planetColors[topic]}, ${lightenColor(planetColors[topic], 20)})`;

        // Update UI
        quizSelection.classList.remove('active');
        quizPage.classList.add('active');
        totalLevels.textContent = currentQuiz.length;

        // Start the quiz
        showQuestion();
        startTimer();
        startTime = new Date();
    }

    function showQuestion() {
        if (currentQuestionIndex >= currentQuiz.length) {
            showResults();
            return;
        }

        const question = currentQuiz[currentQuestionIndex];
        questionText.textContent = question.question;
        currentLevel.textContent = currentQuestionIndex + 1;

        // Update progress
        const progressPercent = (currentQuestionIndex / currentQuiz.length) * 100;
        progressTrail.style.width = `${progressPercent}%`;
        rocket.style.left = `${progressPercent}%`;

        // Clear previous options
        optionsContainer.innerHTML = '';

        // Add new options
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option;
            button.addEventListener('click', selectAnswer);
            optionsContainer.appendChild(button);
        });
    }

    function selectAnswer(e) {
        clearInterval(timer);
        clearInterval(timerInterval);

        const selectedButton = e.target;
        const correctButton = document.querySelector(`.option:nth-child(${currentQuiz[currentQuestionIndex].answer + 1})`);
        const isCorrect = selectedButton === correctButton;

        // Visual feedback
        if (isCorrect) {
            selectedButton.style.background = 'rgba(46, 204, 113, 0.5)';
            selectedButton.style.borderColor = '#2ecc71';
            score++;
        } else {
            selectedButton.style.background = 'rgba(231, 76, 60, 0.5)';
            selectedButton.style.borderColor = '#e74c3c';
            // Highlight correct answer
            correctButton.style.background = 'rgba(46, 204, 113, 0.5)';
            correctButton.style.borderColor = '#2ecc71';
        }

        // Disable all buttons after selection
        const allButtons = document.querySelectorAll('.option');
        allButtons.forEach(button => {
            button.disabled = true;
        });

        // Move to next question after delay
        setTimeout(() => {
            currentQuestionIndex++;
            timeLeft = 30;
            timerElement.textContent = timeLeft;
            showQuestion();
            startTimer();
        }, 1500);
    }


    function startQuiz(topic) {
        // Clear any existing timers
        clearInterval(timer);

        // Reset quiz state
        currentQuiz = [...quizData[topic]];
        currentQuestionIndex = 0;
        score = 0;
        timeLeft = 30;
        selectedTopic = topic;

        // Reset UI elements
        progressTrail.style.width = '0%';
        rocket.style.left = '0%';
        timerElement.textContent = timeLeft;

        // Set planet color based on topic
        planetDisplay.style.background = `linear-gradient(135deg, ${planetColors[topic]}, ${lightenColor(planetColors[topic], 20)})`;

        // Update UI
        quizSelection.classList.remove('active');
        resultsPage.classList.remove('active');
        quizPage.classList.add('active');
        totalLevels.textContent = currentQuiz.length;

        // Start the quiz
        showQuestion();
        startTimer();
        startTime = new Date();
    }

    function showResults() {
        clearInterval(timer);
        clearInterval(timerInterval);
        quizPage.classList.remove('active');
        resultsPage.classList.add('active');
        const endTime = new Date();
        const timeTakenInSeconds = Math.floor((endTime - startTime) / 1000);
        const minutes = Math.floor(timeTakenInSeconds / 60);
        const seconds = timeTakenInSeconds % 60;

        timeTakenElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Update results
        correctAnswersElement.textContent = score;
        totalQuestionsElement.textContent = currentQuiz.length;
        timeTakenElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Calculate stars (1-3)
        const percentage = (score / currentQuiz.length) * 100;
        let starsCount = 1;
        if (percentage >= 80) starsCount = 3;
        else if (percentage >= 50) starsCount = 2;

        // Update stars display
        starsRating.innerHTML = '';
        for (let i = 0; i < starsCount; i++) {
            starsRating.innerHTML += '<span>⭐</span>';
        }
    }

    // Helper function to lighten colors
    function lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;

        return '#' + (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    }
});