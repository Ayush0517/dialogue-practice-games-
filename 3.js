const sentences = [
     { text: "אהבתם את הסרט", audio: "1.mp3" },
     { text: "כן זה היה כל כך מרתק", audio: "1.mp3" },
     { text: "אהבתי את חלליות החייזרים", audio: "1.mp3" },
     { text: "אמא שלכם חושבת שאין דבר כזה חייזרים", audio: "1.mp3" },
     { text: "באמת אני התחלתי לצפות בערוץ ההיסטוריה", audio: "1.mp3" },
     { text: "הם הראו מקומות שאנשים ראו שם חייזרים", audio: "1.mp3" },
     { text: "כמו הר שאסטה והר האולימפוס", audio: "1.mp3" },
     { text: "שמעתי מחברים על הרי האנדים", audio: "1.mp3" },
     { text: "הם אמרו בטלוויזיה שיש שם גם סיפורים על חייזרים", audio: "1.mp3" },
     { text: "יש אנשים שמאמינים ויש שלא", audio: "1.mp3" },
     { text: "אני אישית מאמין שאנחנו לא לבד ביקום", audio: "1.mp3" },
     { text: "בערוץ ההיסטוריה דיברו על שער ליקום אחר", audio: "1.mp3" },
     { text: "בני אדם רחוקים מליצור שער כזה", audio: "1.mp3" },
     { text: "אבל זה נושא מאוד מעניין", audio: "1.mp3" },
     { text: "הלוואי שיותר מדינות היו חוקרות את זה", audio: "1.mp3" },
     { text: "אבא אם חייזרים יבואו מה תעשה", audio: "1.mp3" },
     { text: "הייתי מזמין אותם לקפה", audio: "1.mp3" },
     { text: "ואני הייתי מבקשת סיבוב בחללית שלהם", audio: "1.mp3" },
     { text: "אני פשוט הייתי מתחבא מתחת למיטה שלי", audio: "1.mp3" },
     { text: "אני אוהבת סרטים כאלה על חייזרים", audio: "1.mp3" },
     { text: "אבל גם סרטי אנימציה זה כיף", audio: "1.mp3" },
     { text: "כן לפעמים נחמד לראות סרטים מצויירים", audio: "1.mp3" },
     { text: "אני שמח שנהניתם מהסרט", audio: "1.mp3" },
];

let currentSentenceIndex = 0;
let currentWordIndex = 0;
let errors = [];

const input = document.getElementById("typingInput");
const sentenceDisplay = document.getElementById("sentenceDisplay");
const feedback = document.getElementById("feedback");
const errorsDisplay = document.getElementById("errors");

function removeNikud(str) {
  return str.normalize("NFD").replace(/[\u0591-\u05C7]/g, "");
}

function playAudio(index) {
  const audio = new Audio(`introduction${index + 1}.mp3`);
  audio.play();
}

function displaySentence() {
  const currentQuestion = questions[currentSentenceIndex];
  const words = currentQuestion.hebrewWords;

  sentenceDisplay.innerHTML = words.map((word, index) => {
    return `<span id="word-${index}">${word}</span>`;
  }).join(" ");

  highlightCurrentWord();
  input.value = "";
  input.focus();
  errors = [];
  errorsDisplay.textContent = "";
  playAudio(currentSentenceIndex);
}

function highlightCurrentWord() {
  const spans = sentenceDisplay.querySelectorAll("span");
  spans.forEach((span, i) => {
    span.style.backgroundColor = i === currentWordIndex ? "yellow" : "transparent";
  });
}

input.addEventListener("keydown", function (event) {
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    checkWord();
  }
});

function checkWord() {
  const currentQuestion = questions[currentSentenceIndex];
  const correctWord = removeNikud(currentQuestion.answers[currentWordIndex]);
  const typedWord = removeNikud(input.value.trim());

  const wordSpan = document.getElementById(`word-${currentWordIndex}`);

  if (typedWord === correctWord) {
    wordSpan.style.color = "green";
  } else {
    wordSpan.style.color = "red";
    errors.push(`מילה ${currentWordIndex + 1}: היה צריך "${correctWord}", הקלדת "${typedWord}"`);
  }

  currentWordIndex++;
  input.value = "";

  if (currentWordIndex < currentQuestion.answers.length) {
    highlightCurrentWord();
  } else {
    showErrors();
    currentSentenceIndex++;
    currentWordIndex = 0;

    if (currentSentenceIndex < questions.length) {
      setTimeout(displaySentence, 2000);
    } else {
      feedback.textContent = "כל המשפטים הושלמו!";
      input.disabled = true;
    }
  }
}

function showErrors() {
  if (errors.length > 0) {
    errorsDisplay.innerHTML = "<strong>שגיאות:</strong><br>" + errors.join("<br>");
  } else {
    errorsDisplay.innerHTML = "<strong>בלי שגיאות!</strong>";
  }
}

displaySentence();