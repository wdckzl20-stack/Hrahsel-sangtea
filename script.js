const quizData = [
  {
    question: "What does 'JS' commonly stand for?",
    options: ["Java Syntax", "JavaServer", "JavaScript", "Just Script"],
    answer: "JavaScript"
  },
  {
    question: "Which company originally created JavaScript?",
    options: ["Microsoft", "Google", "Netscape", "Apple"],
    answer: "Netscape"
  },
  {
    question: "Which of these is a primitive type in JavaScript?",
    options: ["Object", "Array", "Number", "Function"],
    answer: "Number"
  },
  {
    question: "Which keyword declares a block-scoped variable in modern JS?",
    options: ["var", "let", "define", "set"],
    answer: "let"
  },
  {
    question: "Which method converts JSON text to a JavaScript object?",
    options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "JSON.decode()"],
    answer: "JSON.parse()"
  }
];

// Config
const timePerQuestion = 15; // seconds

// State
let currentIndex = 0;
let score = 0;
let timer = null;
let timeLeft = timePerQuestion;
let answered = false;

// DOM refs
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progress-bar');
const timeEl = document.getElementById('time');
const resultEl = document.getElementById('result');

// Initialize
function initQuiz() {
  currentIndex = 0;
  score = 0;
  showQuestion();
}

// Show question
function showQuestion() {
  answered = false;
  nextBtn.style.display = 'none';
  resultEl.classList.add('hidden');

  const q = quizData[currentIndex];
  questionEl.textContent = `Q${currentIndex + 1}. ${q.question}`;

  optionsEl.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.className = 'option';
    btn.addEventListener('click', () => selectOption(btn, opt));
    optionsEl.appendChild(btn);
  });

  updateProgress();
  startTimer();
}

// Handle option selection
function selectOption(btn, selected) {
  if (answered) return;
  answered = true;
  stopTimer();

  const correct = quizData[currentIndex].answer;
  const buttons = optionsEl.querySelectorAll('button');

  buttons.forEach(b => b.disabled = true);

  if (selected === correct) {
    btn.classList.add('correct');
    score++;
  } else {
    btn.classList.add('wrong');
    buttons.forEach(b => {
      if (b.textContent === correct) b.classList.add('correct');
    });
  }

  nextBtn.style.display = 'inline-block';
  nextBtn.textContent = currentIndex === quizData.length - 1 ? 'Finish' : 'Next';
}

// Timer
function startTimer() {
  timeLeft = timePerQuestion;
  timeEl.textContent = timeLeft;
  stopTimer();
  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      stopTimer();
      timeUp();
    }
  }, 1000);
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function timeUp() {
  if (answered) return;
  answered = true;

  const correct = quizData[currentIndex].answer;
  const buttons = optionsEl.querySelectorAll('button');
  buttons.forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('correct');
  });

  nextBtn.style.display = 'inline-block';
  nextBtn.textContent = currentIndex === quizData.length - 1 ? 'Finish' : 'Next';
}

// Progress Bar
function updateProgress() {
  const pct = Math.round((currentIndex / quizData.length) * 100);
  progressBar.style.width = pct + '%';
}

// Next button
nextBtn.addEventListener('click', () => {
  stopTimer();
  if (currentIndex < quizData.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    showResult();
  }
});

// Show result
function showResult() {
  stopTimer();
  progressBar.style.width = '100%';
  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `<h2>Your Score: ${score} / ${quizData.length}</h2>
                        <button id="restartBtn">Restart Quiz</button>`;
  document.getElementById('restartBtn').addEventListener('click', initQuiz);
}

// Start
initQuiz();
