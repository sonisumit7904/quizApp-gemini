import React, { useMemo } from "react";
import { useState, useRef } from "react";
import "./Quiz.css";
import { useHistory } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import QuizTimer from "./QuizTimer";

const Quiz = () => {
  const local = JSON.parse(localStorage.getItem("currentQuiz")) || {
    questions: [],
  };
  const data = local.questions || [];

  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[index]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);
  const option_array = [Option1, Option2, Option3, Option4];

  const history = useHistory();

  // Function to safely remove classes from refs
  const removeClassesFromRefs = () => {
    option_array.forEach((option) => {
      option.current?.classList.remove("wrong", "correct", "timeupCorrect");
    });
  };

  const checkAns = (e, ans) => {
    if (lock === false) {
      if (Number(question.correctAnswer) === ans) {
        e.target.classList.add("correct");
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add("wrong");
        const correctOptionIndex = Number(question.correctAnswer) - 1;
        if (option_array[correctOptionIndex]?.current) {
          option_array[correctOptionIndex].current.classList.add("correct");
        }
      }
      setLock(true);
    }
  };

  const next = () => {
    if (lock === true) {
      if (index === data.length - 1) {
        setResult(true);
        return;
      }
      const nextIndex = index + 1;
      setIndex(nextIndex);
      setQuestion(data[nextIndex]);
      setLock(false);
      removeClassesFromRefs();
    }
  };
  const handleTimeOut = () => {
    if (index === data.length - 1) {
      setResult(true);
      return;
    }
    const nextIndex = index + 1;
    removeClassesFromRefs();
    setQuestion(data[nextIndex]);
    setIndex(nextIndex);
    setLock(false);
  };

  const reset = () => {
    setIndex(0);
    setQuestion(data[0]);
    setScore(0);
    setLock(false);
    setResult(false);
    removeClassesFromRefs();
  };

  // Create axios instance with default config
  const axiosInstance = axios.create({
    baseURL: "/Quiz", // This will use the proxy when using Vite config
    headers: {
      "Content-Type": "application/json",
    },
  });
  const gotoMainMenu = async () => {
    try {
      setLoading(true);

      // Get the selected difficulty and topic

      // Step 1: Create the quiz with POST request using axios
      // const id = local.id;

      // // Step 2: Get the quiz questions using the ID
      // const deleteQuizResponse = await axiosInstance.delete(`/Finish/${id}`);

      localStorage.removeItem("currentQuiz");

      history.push("");
    } catch (error) {
      console.error(
        "Error deleting quiz:",
        error?.response?.data || error.message || "Unknown error"
      );

      alert("Failed to delete quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const goToResult = () => {
    setResult(true);
  };
  // Use useMemo to only recreate the timer when the index changes
  const memoizedQuizTimer = useMemo(() => {
    return (
      <QuizTimer key={index} duration={20} handleTimeOut={handleTimeOut} />
    );
  }, [index]);

  ChartJS.register(ArcElement, Tooltip, Legend);
  const chartData = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        label: "Quiz Results",
        data: [score, data.length - score],
        backgroundColor: ["rgba(75, 192, 192, 0.8)", "rgba(255, 99, 132, 0.8)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: "Quiz Results",
        font: {
          size: 16,
        },
      },
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  // Handle case where data is not available
  if (!data || data.length === 0) {
    return (
      <div className="container">
        <h1>Quiz App</h1>
        <hr />
        <p>No questions available</p>
        <button
          onClick={gotoMainMenu}
          className={`start ${loading ? "disabled" : ""}`}
          disabled={loading} // Disable if either is not selected
        >
          {loading ? "Deleting Quiz..." : "Main Menu"}
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="title_timer">
        <h1>Quiz App </h1>
        {!result ? memoizedQuizTimer : ""}
      </div>

      <hr />
      {result ? (
        <>
          <div className="scoreboard">
            <h2>
              You Scored:
              <br /> {score} out of {data.length}
            </h2>
            <div className="doughnutChart">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
          <button onClick={reset}>Retry</button>
          <hr />
          <div className="mainMenu">
            <button
              onClick={gotoMainMenu}
              className={`start ${loading ? "disabled" : ""}`}
              disabled={loading} // Disable if either is not selected
            >
              {loading ? "Deleting Quiz..." : "Main Menu"}
            </button>
            <p>Return to Main Menu</p>
          </div>
        </>
      ) : (
        <>
          <h2>
            {index + 1}. {question.questionTitle}
          </h2>
          <ul>
            <li ref={Option1} onClick={(e) => !lock && checkAns(e, 1)}>
              {question.option1}
            </li>
            <li ref={Option2} onClick={(e) => !lock && checkAns(e, 2)}>
              {question.option2}
            </li>
            <li ref={Option3} onClick={(e) => !lock && checkAns(e, 3)}>
              {question.option3}
            </li>
            <li ref={Option4} onClick={(e) => !lock && checkAns(e, 4)}>
              {question.option4}
            </li>
          </ul>
          <div className="nextFinish">
            <button
              className={`start ${!lock ? "disabled" : ""}`}
              onClick={next}
              disabled={!lock}
            >
              Next
            </button>
            <button onClick={goToResult}>Finish</button>
          </div>
          <div className="index">
            {index + 1} of {data.length} questions
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
