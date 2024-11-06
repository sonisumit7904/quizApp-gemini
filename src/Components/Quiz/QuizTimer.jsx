import React, { useState, useEffect } from "react";
import "./QuizTimer.css";

const QuizTimer = ({ duration = 20, handleTimeOut }) => {
  const [seconds, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime < 1) {
          clearInterval(timer);
          if (typeof handleTimeOut === "function") {
            handleTimeOut();
          }
          // Check if onTimeUp exists and is a function before calling
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount or when duration/handleTimeOut changes

    return () => {
      clearInterval(timer);
    };
  }, [handleTimeOut]);

  return (
    <div className="app">
      <div className="time">Time Left: {seconds}s</div>
    </div>
  );
};

export default QuizTimer;
