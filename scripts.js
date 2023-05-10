const setupContainer = document.getElementById("setup-container");
const quizContainer = document.getElementById("quiz-container");
const resultsContainer = document.getElementById("results-container");

let questions = [];
let currentQuestionIndex = 0;
let numCorrect = 0;
let incorrectAnswers = [];
let numQuestions = 0;

async function fetchQuestions(filename) {
  const response = await fetch(filename);
  return await response.json();
}


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function startQuiz() {
  const numQuestionsInput = document.getElementById("num-questions");
  numQuestions = parseInt(numQuestionsInput.value);

  const quizTypeInput = document.querySelector("input[name=quiz-type]:checked");
  const quizType = quizTypeInput.value;

  if (quizType === "personal") {
    questions = await fetchQuestions("personal_pronouns.json");
  } else if (quizType === "demonstrative") {
    questions = await fetchQuestions("demonstrative_pronouns.json");
  }

  shuffle(questions);
  questions = questions.slice(0, numQuestions); // limit the number of questions

  setupContainer.style.display = "none";
  quizContainer.style.display = "block";

  displayQuestion(currentQuestionIndex);
}

  
 async function renderQuestion() {
    questions = await fetchQuestions();
    shuffle(questions);
  
    displayQuestion(currentQuestionIndex);
  }

function checkAnswer() {
  const answerContainer = quizContainer.querySelector(
    `.answers input[name=question]:checked`
  );

  const userAnswer = answerContainer ? answerContainer.value : "";
  const currentQuestion = questions[currentQuestionIndex];

  if (userAnswer === currentQuestion.correctAnswer) {
    resultsContainer.innerHTML = "Correct!";
    numCorrect++;
  } else {
    resultsContainer.innerHTML = `Incorrect! The correct answer is: ${
      currentQuestion.answers[currentQuestion.correctAnswer]
    }`;
    incorrectAnswers.push({
      question: currentQuestion.question,
      correctAnswer: currentQuestion.answers[currentQuestion.correctAnswer]
    });
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    setTimeout(() => {
      displayQuestion(currentQuestionIndex);
      resultsContainer.innerHTML = "";
    }, 2000);
  } else {
    setTimeout(() => {
      displayResults();
    }, 2000);
  }
}

function displayQuestion(index) {
    const currentQuestion = questions[index];
    const answers = [];
  
    for (letter in currentQuestion.answers) {
      answers.push(
        `<label>
          <input type="radio" name="question" value="${letter}">
          ${letter} : ${currentQuestion.answers[letter]}
        </label><br>` // Add a line break after each label
      );
    }
  
    quizContainer.innerHTML = `
      <div class="question">${currentQuestion.question}</div>
      <div class="answers">${answers.join("")}</div>
      <button onclick="checkAnswer()">Submit</button>
    `;
  }

// function displayResults() {
//   quizContainer.innerHTML = "Quiz completed!";
//   resultsContainer.innerHTML = `You got ${numCorrect} out of ${questions.length} correct!`;

//   if (incorrectAnswers.length > 0) {
//     const incorrectList = document.createElement("ul");
//     incorrectAnswers.forEach(({ question, correctAnswer }) => {
//       const listItem = document.createElement("li");
//       listItem.innerHTML = `${question}<br>Correct answer: ${correctAnswer}`;
//       incorrectList.appendChild(listItem);
//     });

//     resultsContainer.appendChild(incorrectList);
//   }
// }
// function displayResults() {
//   quizContainer.innerHTML = "Quiz completed!";
//   resultsContainer.innerHTML = `You got ${numCorrect} out of ${questions.length} correct!`;

//   if (incorrectAnswers.length > 0) {
//     const incorrectList = document.createElement("ul");
//     incorrectAnswers.forEach(({ question, correctAnswer }) => {
//       const listItem = document.createElement("li");
//       listItem.innerHTML = `${question}<br>Correct answer: ${correctAnswer}`;
//       incorrectList.appendChild(listItem);
//     });

//     resultsContainer.appendChild(incorrectList);
//   }

//   // Add buttons for starting a new quiz, retaking the quiz, and retrying missed questions
//   const newQuizButton = document.createElement("button");
//   newQuizButton.innerHTML = "Start New Quiz";
//   newQuizButton.onclick = startNewQuiz;

//   const retakeButton = document.createElement("button");
//   retakeButton.innerHTML = "Retake Quiz";
//   retakeButton.onclick = restartQuiz;

//   const retryButton = document.createElement("button");
//   retryButton.innerHTML = "Retry Missed Questions";
//   retryButton.onclick = retryMissed;

//   resultsContainer.appendChild(newQuizButton);
//   resultsContainer.appendChild(retakeButton);
//   resultsContainer.appendChild(retryButton);
// }

function displayResults() {
  quizContainer.innerHTML = "Quiz completed!";
  resultsContainer.innerHTML = `You got ${numCorrect} out of ${questions.length} correct! <br>`;

  // Add "New Quiz" and "Retake Quiz" buttons
  resultsContainer.innerHTML += `
    <button onclick="newQuiz()">New Quiz</button>
    <button onclick="restartQuiz()">Retake Quiz</button>
  `;

  // Display the "Retry Missed Questions" button only if there are missed questions
  if (incorrectAnswers.length > 0) {
    resultsContainer.innerHTML += `<button onclick="retryMissed()">Retry Missed Questions</button>`;

    const incorrectList = document.createElement("ul");
    incorrectAnswers.forEach(({ question, correctAnswer }) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `${question}<br>Correct answer: ${correctAnswer}`;
      incorrectList.appendChild(listItem);
    });

    resultsContainer.appendChild(incorrectList);
  }
}



function newQuiz() {
  // Reset variables and containers
  currentQuestionIndex = 0;
  numCorrect = 0;
  incorrectAnswers = [];
  resultsContainer.innerHTML = "";
  quizContainer.innerHTML = "";

  // Show the setup container
  setupContainer.style.display = "block";

  // Hide the quiz container
  quizContainer.style.display = "none";
  
  // Reset the input field for the number of questions
  document.getElementById("num-questions").value = "";
}

function restartQuiz() {
  currentQuestionIndex = 0;
  numCorrect = 0;
  incorrectAnswers = [];
  shuffle(questions);
  resultsContainer.innerHTML = ""; // Clear the results container
  displayQuestion(currentQuestionIndex);
}

function retryMissed() {
  currentQuestionIndex = 0;
  numCorrect = 0;
  questions = incorrectAnswers.map(({ question, correctAnswer }) =>
    questions.find((q) => q.question === question)
  );
  incorrectAnswers = [];
  resultsContainer.innerHTML = ""; // Clear the results container
  displayQuestion(currentQuestionIndex);
}


// renderQuestion();
