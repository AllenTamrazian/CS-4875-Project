// Fetch and load the quiz questions from a JSON file
function loadQuizzes() {
    fetch('quizzes.json')
        .then(response => response.json())
        .then(data => {
            generateQuiz(data.module1.questions, 'quiz-1');
            generateQuiz(data.module2.questions, 'quiz-2');
            generateQuiz(data.module3.questions, 'quiz-3');
        })
        .catch(error => console.error('Error loading quizzes:', error));
}

// Dynamically generate a quiz based on questions from JSON
function generateQuiz(questions, quizContainerId) {
    const quizContainer = document.getElementById(quizContainerId);
    quizContainer.innerHTML = ''; // Clear existing content

    questions.forEach((questionData, index) => {
        // Create a question element
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `<h4>${index + 1}. ${questionData.question}</h4>`;

        // Create radio buttons for each option
        questionData.options.forEach(option => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="radio" name="quiz-${quizContainerId}-${index}" value="${option}"> ${option}`;
            questionElement.appendChild(label);
            questionElement.appendChild(document.createElement('br'));
        });

        // Add the question to the quiz container
        quizContainer.appendChild(questionElement);
    });

    // Add a submit button for the quiz
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Quiz';
    submitButton.addEventListener('click', () => checkQuiz(questions, quizContainerId));
    quizContainer.appendChild(submitButton);
}

// Check quiz answers and give feedback
function checkQuiz(questions, quizContainerId) {
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || {}; // Retrieve stored results or initialize

    questions.forEach((questionData, index) => {
        const selectedAnswer = document.querySelector(`input[name="quiz-${quizContainerId}-${index}"]:checked`);
        if (selectedAnswer && selectedAnswer.value === questionData.correctAnswer) {
            alert(`Question ${index + 1}: Correct!`);
            quizResults[`${quizContainerId}-${index}`] = "Correct";
        } else {
            alert(`Question ${index + 1}: Incorrect. Correct answer: ${questionData.correctAnswer}`);
            quizResults[`${quizContainerId}-${index}`] = "Incorrect";
        }
    });

    localStorage.setItem('quizResults', JSON.stringify(quizResults)); // Store results
    displayProgress(quizContainerId); // Update progress display
}

// Display user progress based on saved results
function displayProgress(quizContainerId) {
    const quizResults = JSON.parse(localStorage.getItem('quizResults')) || {};
    const resultContainer = document.getElementById(`${quizContainerId}-result`);
    const resultsForQuiz = Object.keys(quizResults).filter(key => key.startsWith(quizContainerId));

    if (resultsForQuiz.length) {
        resultContainer.textContent = 'Your previous results: ' + resultsForQuiz.map(result => quizResults[result]).join(', ');
    } else {
        resultContainer.textContent = '';
    }
}

// Initialize Kotlin Playground
function initializePlaygrounds() {
    KotlinPlayground('kotlin-playground-1');
    KotlinPlayground('kotlin-playground-2');
    KotlinPlayground('kotlin-playground-3');
}

// Call the load functions on page load
window.onload = function() {
    loadQuizzes();
    initializePlaygrounds();
};
