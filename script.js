/**
 * IT 3203 Educational Website - Quiz Functionality
 * This script handles the quiz logic, form validation, result calculation,
 * and interaction with localStorage for persistence.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const quizForm = document.getElementById('quiz-form');
    const quizResults = document.getElementById('quiz-results');
    const submitButton = document.getElementById('submit-quiz');
    const resetButton = document.getElementById('reset-quiz');
    const retakeButton = document.getElementById('retake-quiz');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-container .flex span');
    const q3Input = document.getElementById('q3');
    const scoreDisplay = document.querySelector('.score-value');
    const feedbackMessage = document.querySelector('.feedback-message');
    const saveIndicator = document.querySelector('.save-indicator');
    const previousAttemptsContainer = document.getElementById('previous-attempts');
    
    // Define correct answers
    const correctAnswers = {
        q1: 'q1-b', // Canvas
        q2: 'q2-c', // Collaborative Learning
        q3: 'collaborative learning', // Fill in the blank
        q4: 'q4-c', // Virtual Reality
        q5: ['q5-a', 'q5-c', 'q5-d'] // Multiple correct answers
    };
    
    // Define quiz state
    let answers = {
        q1: null,
        q2: null,
        q3: '',
        q4: null,
        q5: []
    };
    
    // Attempt history
    let previousAttempts = JSON.parse(localStorage.getItem('quizAttempts')) || [];
    
    // Initialize the quiz
    initQuiz();
    
    /**
     * Initialize the quiz state
     */
    function initQuiz() {
        loadSavedAnswers();
        updateProgress();
        renderPreviousAttempts();
        setupEventListeners();
    }
    
    /**
     * Load saved answers from localStorage
     */
    function loadSavedAnswers() {
        const savedAnswers = localStorage.getItem('quizAnswers');
        if (savedAnswers) {
            try {
                answers = JSON.parse(savedAnswers);
                
                // Restore radio button selections
                document.querySelectorAll('input[type="radio"]').forEach(radio => {
                    radio.checked = radio.value === answers[radio.name];
                });
                
                // Restore checkbox selections
                document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = answers.q5.includes(checkbox.value);
                });
                
                // Restore text input
                if (q3Input) q3Input.value = answers.q3 || '';
            } catch (e) {
                console.error('Failed to parse saved answers', e);
                resetAnswers();
            }
        }
    }
    
    /**
     * Set up event listeners for quiz interaction
     */
    function setupEventListeners() {
        // Radio button change events
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', handleRadioChange);
        });
        
        // Checkbox change events
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', handleCheckboxChange);
        });
        
        // Text input change event
        if (q3Input) {
            q3Input.addEventListener('input', handleTextChange);
        }
        
        // Button click events
        if (submitButton) submitButton.addEventListener('click', submitQuiz);
        if (resetButton) resetButton.addEventListener('click', resetAnswers);
        if (retakeButton) retakeButton.addEventListener('click', retakeQuiz);
    }
    
    /**
     * Handle radio button changes
     */
    function handleRadioChange(e) {
        const { name, value } = e.target;
        answers[name] = value;
        saveAnswers();
        updateProgress();
    }
    
    /**
     * Handle checkbox changes
     */
    function handleCheckboxChange(e) {
        const { value, checked } = e.target;
        
        if (checked && !answers.q5.includes(value)) {
            answers.q5.push(value);
        } else if (!checked && answers.q5.includes(value)) {
            answers.q5 = answers.q5.filter(item => item !== value);
        }
        
        saveAnswers();
        updateProgress();
    }
    
    /**
     * Handle text input changes
     */
    function handleTextChange(e) {
        answers.q3 = e.target.value;
        saveAnswers();
        updateProgress();
    }
    
    /**
     * Save answers to localStorage
     */
    function saveAnswers() {
        localStorage.setItem('quizAnswers', JSON.stringify(answers));
    }
    
    /**
     * Update the progress bar
     */
    function updateProgress() {
        const totalQuestions = 5;
        let completedQuestions = 0;
        
        if (answers.q1) completedQuestions++;
        if (answers.q2) completedQuestions++;
        if (answers.q3.trim() !== '') completedQuestions++;
        if (answers.q4) completedQuestions++;
        if (answers.q5.length > 0) completedQuestions++;
        
        const progressPercentage = Math.round((completedQuestions / totalQuestions) * 100);
        
        if (progressFill) progressFill.style.width = `${progressPercentage}%`;
        if (progressText) progressText.textContent = `${progressPercentage}% Complete`;
    }
    
    /**
     * Submit the quiz and show results
     */
    function submitQuiz() {
        const score = calculateScore();
        const isPassed = score >= 4; // 80% pass mark (4/5)
        
        // Prepare quiz result object
        const quizResult = {
            score: score,
            answers: { ...answers },
            date: new Date().toLocaleString(),
            isPassed: isPassed
        };
        
        // Add to attempt history
        previousAttempts.push(quizResult);
        localStorage.setItem('quizAttempts', JSON.stringify(previousAttempts));
        
        // Show results
        displayResults(score, isPassed);
    }
    
    /**
     * Calculate quiz score
     */
    function calculateScore() {
        let score = 0;
        
        // Question 1 (single choice)
        if (answers.q1 === correctAnswers.q1) score++;
        
        // Question 2 (single choice)
        if (answers.q2 === correctAnswers.q2) score++;
        
        // Question 3 (fill in blank)
        if (answers.q3.toLowerCase().trim() === correctAnswers.q3) score++;
        
        // Question 4 (single choice)
        if (answers.q4 === correctAnswers.q4) score++;
        
        // Question 5 (multiple choice)
        // All correct options must be selected and no incorrect options
        const q5Correct = correctAnswers.q5.every(answer => 
            answers.q5.includes(answer)) && 
            answers.q5.every(answer => 
            correctAnswers.q5.includes(answer));
        
        if (q5Correct) score++;
        
        return score;
    }
    
    /**
     * Display quiz results
     */
    function displayResults(score, isPassed) {
        // Hide quiz form, show results
        quizForm.style.display = 'none';
        quizResults.style.display = 'block';
        
        // Update score display
        scoreDisplay.textContent = `${score}/5`;
        
        // Update result circle class
        const scoreCircle = document.querySelector('.score-circle');
        if (scoreCircle) {
            if (isPassed) {
                scoreCircle.classList.remove('failed');
            } else {
                scoreCircle.classList.add('failed');
            }
        }
        
        // Update feedback message
        if (feedbackMessage) {
            feedbackMessage.textContent = isPassed 
                ? "Great job! You passed! 🎉" 
                : "Almost there! Keep studying! 💪";
        }
        
        // Hide save indicator after 2 seconds
        setTimeout(() => {
            if (saveIndicator) saveIndicator.style.display = 'none';
        }, 2000);
        
        // Generate review items
        generateReviewItems();
        
        // Render previous attempts
        renderPreviousAttempts();
    }
    
    /**
     * Generate review items for each question
     */
    function generateReviewItems() {
        const reviewContainer = document.querySelector('.question-review');
        if (!reviewContainer) return;
        
        // Clear existing reviews
        while (reviewContainer.children.length > 1) {
            reviewContainer.removeChild(reviewContainer.lastChild);
        }
        
        // Generate review for each question
        const isCorrect = {
            q1: answers.q1 === correctAnswers.q1,
            q2: answers.q2 === correctAnswers.q2,
            q3: answers.q3.toLowerCase().trim() === correctAnswers.q3,
            q4: answers.q4 === correctAnswers.q4,
            q5: correctAnswers.q5.every(a => answers.q5.includes(a)) && 
                answers.q5.every(a => correctAnswers.q5.includes(a))
        };
        
        // Question 1 Review
        const q1Review = createReviewItem(
            isCorrect.q1,
            "Question 1: Learning Management Systems",
            "Which of the following is a Learning Management System?",
            "Correct answer: Canvas"
        );
        reviewContainer.appendChild(q1Review);
        
        // Question 2 Review
        const q2Review = createReviewItem(
            isCorrect.q2,
            "Question 2: Teaching Approaches",
            "Which teaching approach involves students working together to solve problems?",
            "Correct answer: Collaborative Learning"
        );
        reviewContainer.appendChild(q2Review);
        
        // Question 3 Review
        const q3Review = createReviewItem(
            isCorrect.q3,
            "Question 3: Fill in the Blank",
            "Fill in the blank: ____________ is an educational approach that involves groups of students working together...",
            "Correct answer: \"collaborative learning\""
        );
        reviewContainer.appendChild(q3Review);
        
        // Question 4 Review
        const q4Review = createReviewItem(
            isCorrect.q4,
            "Question 4: Immersive Technologies",
            "Which of the following technologies can help create immersive learning experiences?",
            "Correct answer: Virtual Reality"
        );
        reviewContainer.appendChild(q4Review);
        
        // Question 5 Review
        const q5Review = createReviewItem(
            isCorrect.q5,
            "Question 5: Benefits of Collaborative Learning",
            "Which of the following are benefits of collaborative learning?",
            "Correct answers: Develops higher-level thinking skills, Increases student retention, and Builds self-esteem in students"
        );
        reviewContainer.appendChild(q5Review);
        
        // Show appropriate tip based on pass/fail
        const quizTip = document.querySelector('.quiz-tip');
        if (quizTip) {
            const tipContent = quizTip.querySelector('p');
            if (tipContent) {
                const isPassed = calculateScore() >= 4;
                if (isPassed) {
                    tipContent.innerHTML = '🎓 <strong>Pro Tip:</strong> Now that you\'ve mastered this quiz, why not check out Topic 2 for more interesting content?';
                } else {
                    tipContent.innerHTML = '💡 <strong>Study Tip:</strong> Review the content in Topic 1 again, focusing on the questions you missed. You\'ll nail it next time!';
                }
            }
        }
    }
    
    /**
     * Create a review item element
     */
    function createReviewItem(isCorrect, title, question, answer) {
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
        
        reviewItem.innerHTML = `
            <div class="review-header">
                <div class="review-icon">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${isCorrect 
                            ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
                            : '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'}
                    </svg>
                </div>
                <div class="review-content">
                    <h4>${title}</h4>
                    <p>${question}</p>
                    <p class="answer-note">${answer}</p>
                </div>
            </div>
        `;
        
        return reviewItem;
    }
    
    /**
     * Render previous quiz attempts
     */
    function renderPreviousAttempts() {
        if (!previousAttemptsContainer || previousAttempts.length === 0) return;
        
        // Clear existing attempts
        while (previousAttemptsContainer.children.length > 1) {
            previousAttemptsContainer.removeChild(previousAttemptsContainer.lastChild);
        }
        
        // Add each attempt to the container
        previousAttempts.forEach(attempt => {
            const attemptItem = document.createElement('div');
            attemptItem.className = 'attempt-item';
            
            attemptItem.innerHTML = `
                <span>${attempt.date}</span>
                <span class="${attempt.isPassed ? 'passed' : 'failed'}">
                    ${attempt.score}/5 (${attempt.isPassed ? 'Passed' : 'Failed'})
                </span>
            `;
            
            previousAttemptsContainer.appendChild(attemptItem);
        });
        
        // Show or hide container based on attempts
        previousAttemptsContainer.style.display = previousAttempts.length > 0 ? 'block' : 'none';
    }
    
    /**
     * Reset all quiz answers
     */
    function resetAnswers() {
        // Reset form inputs
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
        if (q3Input) q3Input.value = '';
        
        // Reset answers object
        answers = {
            q1: null,
            q2: null,
            q3: '',
            q4: null,
            q5: []
        };
        
        // Update localStorage and progress
        localStorage.removeItem('quizAnswers');
        updateProgress();
    }
    
    /**
     * Retake the quiz
     */
    function retakeQuiz() {
        // Hide results, show form
        quizResults.style.display = 'none';
        quizForm.style.display = 'block';
        
        // Reset answers
        resetAnswers();
    }
});