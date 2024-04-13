// select elements
const bullets = document.querySelector(".bullets");
const questionsCountSpan = document.querySelector(".qusitoun-count span");
const bulletsSpanContainer = document.querySelector(".bullets .spans");
const answersContainer = document.querySelector(".answers-container");
const submitButton = document.querySelector(".submit");
const resulteDiv = document.querySelector(".results");
const minutesSpan = document.querySelector(".bullets .count-down .minutes");
const countDownDiv = document.querySelector(".bullets .count-down");
// set options
let currentIndex = 0;
let rAnswers = 0; // for the finel score
let wAnswers = 0; // for the finel score
let countDownIntervel;
// create the fetch data function
async function getData() {
  const data = await fetch("./countries_questions.json");
  const dataObject = await data.json();
  // create bullets + set qusitions number
  let questionsNumber = dataObject.length;
  questionsCount(questionsNumber);
  // add data
  addData(dataObject[currentIndex], questionsNumber);

  // count down
  countDown(60, questionsNumber);

  // click on submit
  submitButton.addEventListener("click", () => {
    // select the right answer
    let rightAnswer = dataObject[currentIndex]["right_answer"];

    // increase index
    currentIndex++;

    // check the answers
    checkeAnswer(rightAnswer, questionsNumber);

    // remove the q & the answers after click on the submit and check the value
    answersContainer.innerHTML = "";

    // add new data using the addData function (its new cuz i ++ the current index after click the button)
    addData(dataObject[currentIndex], questionsNumber);
    // hundle the bullets class's
    hundleBulletsClasses();
    // count down start agine on click
    clearInterval(countDownIntervel);
    countDown(60, questionsNumber);
    // show resulte after all answers are done
    showResult(questionsNumber);
  });
}

// run the quiz game
getData();

// create bullets + set qusitions number
function questionsCount(number) {
  questionsCountSpan.innerHTML = number;

  // create spans
  for (let i = 0; i < number; i++) {
    let bullet = document.createElement("span");
    // check if its the first qusition to add the on class to it
    if (i === 0) {
      bullet.className = "on";
    }
    // apped bullets to main bullets container
    bulletsSpanContainer.append(bullet);
  }
}

// create addData function
function addData(obj, count) {
  // the if condation is to check if the all of the answers showed then it will stop creating new data or create data only if there answers and q
  if (currentIndex < count) {
    // create the h1 for the qustion
    const qusition = document.createElement("h1");
    // append the qusition to the h1
    qusition.innerHTML = obj["title"];
    // append the h1 to the answers container
    answersContainer.append(qusition);
    // create the main div and add class to it + apped it to the answersContainer
    const mainDiv = document.createElement("div");
    mainDiv.className = "answers";
    answersContainer.append(mainDiv);
    // create the answers logic
    for (let i = 0; i < 4; i++) {
      // create the answer div
      const answerDiv = document.createElement("div");
      answerDiv.className = "answer";
      // create the radio input
      const radio = document.createElement("input");
      // add type + name + id + data attr
      radio.type = "radio";
      radio.name = "qusition";
      radio.id = `answer_${i + 1}`;
      radio.dataset.answer = obj[`answer_${i + 1}`];
      // make the first radio input checked
      if (i === 0) {
        radio.checked = true;
      }
      // create label
      const label = document.createElement("label");
      // add for to lable
      label.htmlFor = `answer_${i + 1}`;
      // create label text
      label.innerHTML = obj[`answer_${i + 1}`];
      // append radio and label to answer div
      answerDiv.append(radio);
      answerDiv.append(label);
      // apped the answer div to the
      mainDiv.append(answerDiv);
    }
  }
}

function checkeAnswer(rightAnswer, count) {
  // get the radio's by there name attr
  const answers = document.getElementsByName("qusition");
  let choosenAnswer;
  // loop on answers to get the answer resulte
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked === true) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  // add score
  if (choosenAnswer === rightAnswer) {
    rAnswers++;
  } else {
    wAnswers++;
  }
}

function hundleBulletsClasses() {
  let spans = document.querySelectorAll(".bullets .spans span");
  spans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResult(count) {
  if (currentIndex === count) {
    // if the answers are all done
    // remove the coming elements cuz i don't need them anymore
    answersContainer.remove();
    submitButton.remove();
    bullets.remove();

    // here i should get the right answers and make the (hero medium beginner system <go back to css to know what i am taking about>)
    if (rAnswers > count / 2 && rAnswers < count) {
      // create span and add the resulte to it
      let Levelspan = document.createElement("span");
      Levelspan.className = "good";
      Levelspan.innerHTML = "good ";
      let span = document.createElement("span");
      span.innerHTML = `you answered ${rAnswers} from ${count}`;
      resulteDiv.append(Levelspan);
      resulteDiv.append(span);
    } else if (rAnswers <= count / 2) {
      // create span and add the resulte to it
      let Levelspan = document.createElement("span");
      Levelspan.className = "bad";
      Levelspan.innerHTML = "bad ";
      let span = document.createElement("span");
      span.innerHTML = `you answered ${rAnswers} from ${count}`;
      resulteDiv.append(Levelspan);
      resulteDiv.append(span);
    } else {
      // create span and add the resulte to it
      let Levelspan = document.createElement("span");
      Levelspan.className = "hero";
      Levelspan.innerHTML = "hero ";
      let span = document.createElement("span");
      span.innerHTML = `you answered ${rAnswers} from ${count}`;
      resulteDiv.append(Levelspan);
      resulteDiv.append(span);
    }
    // inside the if statment
    const restartButton = document.createElement("button");
    restartButton.className = "restart";
    restartButton.innerHTML = "restart";
    resulteDiv.after(restartButton);
    // add event listener to the button
    restartButton.addEventListener("click", () => {
      location.reload();
    });
  }
}
// count dawn timer
function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownIntervel = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      // return 0 before the number of sec and min if its under the 10
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownDiv.innerHTML = `<span>${minutes}</span> : <span>${seconds}</span>`;

      if (--duration < 0) {
        clearInterval(countDownIntervel);
        submitButton.click();
      }
    }, 1000);
  }
}
