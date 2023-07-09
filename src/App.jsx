import "./App.css";
import Question from "./components/Question";
import { useState, useEffect } from "react";

// function to shuffle array elements to mix correct with incorrect answers
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function App() {
  let [home, setHome] = useState(true); // state of homepage
  let [allQuestions, setAllQuestions] = useState([]); // stores questions retrieved from api
  let [choices, setChoices] = useState([]); // stores the shuffled choices

  let [allAnswers, setAllAnswers] = useState([
    { choice: "", status: "incorrect" },
    { choice: "", status: "incorrect" },
    { choice: "", status: "incorrect" },
    { choice: "", status: "incorrect" },
    { choice: "", status: "incorrect" },
  ]); // stores user's answers

  let [grade, setGrade] = useState(-1);
  // storing retrieved question in allQuestions array from API and shuffling the choices
  useEffect(() => {
    fetch(
      "https://opentdb.com/api.php?amount=5&category=14&difficulty=easy&type=multiple"
    )
      .then((res) => res.json())
      .then((data) => {
        setAllQuestions(
          data.results.map((result, ind) => {
            // set up the object to be stored in questions state
            let obj = {
              question: result.question,
              correct: result.correct_answer,
              incorrect: result.incorrect_answers,
              qIndex: ind,
            };

            // prepare this question's shuffled answers
            // 1st push incorrect answers
            let answers = result.incorrect_answers.map((i) => ({
              answer: i,
              status: "incorrect",
            }));
            answers.push({ answer: result.correct_answer, status: "correct" }); // then the correct one
            answers = shuffleArray(answers); // then shuffle

            // set the choices state
            setChoices((prev) => {
              let temp = [...prev];
              temp[ind] = answers;
              return temp;
            });
            return obj; // return obj for the allQuestions state's map function
          })
        );
      });
  }, []);

  // update answer in allAnswers state on choice selection
  function updateAnswer(index, choice, status) {
    setAllAnswers((prev) => {
      let temp = [...prev];
      temp[index].choice = choice;
      temp[index].status = status;
      return temp;
    });
    console.log(allAnswers);
  }

  function submit() {
    let g = 0;
    allAnswers.forEach((el) => {
      if (el.status == "correct") {
        g += 1;
      }
    });

    setGrade(g);
  }

  function begin(){
    setHome(false);
  }
  
  return (
    <>
      <main>
        {home && <div className='homePage'><h1>Binge Watcher Test</h1>
        <div>Test your TV shows knowledge now and see if you're a real serioholic or not!</div>
        <button onClick={begin}>Begin the Test!</button>
        </div>}

        {!home &&
          allQuestions.map((q, index) => {
            return (
              <Question
                question={q.question}
                answers={choices[index]}
                index={q.qIndex}
                update={updateAnswer}
                grade={grade}
              />
            );
          })}
        {!home && (
          <div className="finishBar">
            {grade != -1 && (
              <span className="score">
                You've scored{" "}
                <span style={{ color: "green", fontWeight: "bold" }}>
                  {grade}
                </span>
                /5
              </span>
            )}
            <button onClick={submit}>Submit</button>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
