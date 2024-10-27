// Load quizzes from JSON file
function loadQuizzes() {
    fetch('quizzes.json')
        .then(response => response.json())
        .then(data => {
            Object.keys(data).forEach((moduleKey, index) => {
                generateQuiz(data[moduleKey].questions, `quiz-${index + 1}`);
            });
        })
        .catch(error => console.error('Error loading quizzes:', error));
}

// Dynamically generate quiz questions
function generateQuiz(questions, quizContainerId) {
    const quizContainer = document.getElementById(quizContainerId);
    quizContainer.innerHTML = '';

    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `<h4>${index + 1}. ${question.question}</h4>`;
        
        question.options.forEach(option => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="radio" name="quiz-${quizContainerId}-${index}" value="${option}"> ${option}`;
            questionDiv.appendChild(label);
            questionDiv.appendChild(document.createElement('br'));
        });
        
        quizContainer.appendChild(questionDiv);
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Quiz';
    submitButton.addEventListener('click', () => checkQuiz(questions, quizContainerId));
    quizContainer.appendChild(submitButton);

    // Add result display and progress bar
    const resultContainer = document.createElement('div');
    resultContainer.id = `${quizContainerId}-result`;
    resultContainer.classList.add('result');
    quizContainer.appendChild(resultContainer);

    const progressBarContainer = document.createElement('div');
    progressBarContainer.classList.add('progress-bar-container');
    const progressBar = document.createElement('div');
    progressBar.id = `progress-bar-${quizContainerId.split('-')[1]}`;
    progressBar.classList.add('progress-bar');
    progressBarContainer.appendChild(progressBar);
    quizContainer.appendChild(progressBarContainer);
}

// Check and display quiz results
function checkQuiz(questions, quizContainerId) {
    const results = {}; // clear previous results each time a quiz is checked
    let correctAnswers = 0;

    questions.forEach((question, index) => {
        const selectedAnswer = document.querySelector(`input[name="quiz-${quizContainerId}-${index}"]:checked`);
        
        // Debugging line to log correct answer vs selected answer
        console.log(`Question ${index + 1}: Correct Answer - "${question.correctAnswer}", Selected Answer - "${selectedAnswer ? selectedAnswer.value : "None"}"`);
        
        if (selectedAnswer && selectedAnswer.value === question.correctAnswer) {
            results[`${quizContainerId}-${index}`] = "Correct";
            correctAnswers++;
        } else {
            results[`${quizContainerId}-${index}`] = "Incorrect";
        }
    });

    localStorage.setItem('quizResults', JSON.stringify(results));
    displayProgress(quizContainerId, correctAnswers, questions.length);
}

// Display saved quiz progress
function displayProgress(quizContainerId, correctAnswers, totalQuestions) {
    const resultContainer = document.getElementById(`${quizContainerId}-result`);
    resultContainer.innerHTML = `Results: ${correctAnswers} out of ${totalQuestions} correct`;

    // Update the progress bar
    const progressBar = document.getElementById(`progress-bar-${quizContainerId.split('-')[1]}`);
    const progress = (correctAnswers / totalQuestions) * 100;
    progressBar.style.width = progress + '%';
}

// Initialize Kotlin Playgrounds
function initializePlaygrounds() {
    for (let i = 1; i <= 12; i++) {  // Updated for 12 modules
        KotlinPlayground(`kotlin-playground-${i}`);
    }
}

// Run functions on page load
window.onload = function() {
    loadQuizzes();
    initializePlaygrounds();
};
