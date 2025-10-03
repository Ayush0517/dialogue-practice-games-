const sentences = [
     { text: "ניצן אני ואבא חשבנו לקחת אותך לטיול בת מצווה בחול", audio: "1.mp3" },
     { text: "אני כבר מתרגשת יש לי כמה רעיונות", audio: "1.mp3" },
     { text: "אני חשבתי על איסלנד זה יעד מיוחד עם נופים מדהימים", audio: "1.mp3" },
     { text: "ואני חשבתי על ארצות הברית יש שם הכל נופים פארקים מוזיאונים", audio: "1.mp3" },
     { text: "נשמע נחמד אבל אני רוצה לטוס למקום אחר", audio: "1.mp3" },
     { text: "לאן", audio: "1.mp3" },
     { text: "אני רוצה לטוס לאוסטרליה", audio: "1.mp3" },
     { text: "אוסטרליה זה רחוק מאוד", audio: "1.mp3" },
     { text: "נכון אבל תמיד רציתי לראות את החיות שם במיוחד בגן החיות האוסטרלי המפורסם", audio: "1.mp3" },
     { text: "זה הגן חיות שהראית לנו באחד הערוצים בטלוויזיה נכון", audio: "1.mp3" },
     { text: "כן ראיתי סרטים על הקנגורו הקואלות ועוד חיות נדירות שם", audio: "1.mp3" },
     { text: "זה החלום שלי להיות שם", audio: "1.mp3" },
     { text: "זה נשמע מיוחד אבל זו טיסה ארוכה מאוד זה יהיה לנו קשה", audio: "1.mp3" },
     { text: "בת מצווה זה אירוע של פעם בחיים יניב נעשה מאמץ אם זה מה שהיא רוצה", audio: "1.mp3" },
     { text: "כן בבקשה זה החלום שלי לטוס לשם", audio: "1.mp3" },
     { text: "טוב אם זה ככה אז אני מתחיל לבדוק ולתכנן את הטיול לאוסטרליה", audio: "1.mp3" },
     { text: "יש איזה כיף תודה אמא ואבא", audio: "1.mp3" },
     { text: "אני יודעת שאת אוהבת לצפות בקנגורו רק תזכרי שהחיות האלה מסוכנות", audio: "1.mp3" },
     { text: "אני לא יודעת אם תוכלי להצטלם איתם", audio: "1.mp3" },
     { text: "אולי ייצא לנו לראות אותם מרחוק יסבירו לנו כבר שם", audio: "1.mp3" },
     { text: "כן נישאל את המדריכים כשנהיה שם ונישמע להוראות שלהם", audio: "1.mp3" },

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