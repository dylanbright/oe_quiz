const setupContainer = document.getElementById("setup-container");
const quizContainer = document.getElementById("quiz-container");
const resultsContainer = document.getElementById("results-container");

let questions = [];
let currentQuestionIndex = 0;
let numCorrect = 0;
let incorrectAnswers = [];
let numQuestions = 0;

async function fetchQuestions() {
  const response = await fetch("personal_pronouns.json");
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

  questions = await fetchQuestions();
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
        </label>`
      );
    }
  
    quizContainer.innerHTML = `
      <div class="question">${currentQuestion.question}</div>
      <div class="answers">${answers.join("")}</div>
      <button onclick="checkAnswer()">Submit</button>
    `;
  }

function displayResults() {
  quizContainer.innerHTML = "Quiz completed!";
  resultsContainer.innerHTML = `You got ${numCorrect} out of ${questions.length} correct!`;

  if (incorrectAnswers.length > 0) {
    const incorrectList = document.createElement("ul");
    incorrectAnswers.forEach(({ question, correctAnswer }) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `${question}<br>Correct answer: ${correctAnswer}`;
      incorrectList.appendChild(listItem);
    });

    resultsContainer.appendChild(incorrectList);
  }
}

renderQuestion();
