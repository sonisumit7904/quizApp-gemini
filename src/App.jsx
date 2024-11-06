import React, { useEffect } from "react";
import Quiz from "./Components/Quiz/Quiz";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Head from "./Components/Head/Head";
import axios from "axios";
import { useDispatch } from "react-redux";
import QuestionForm from "./Components/QuestionForm/QuestionForm";

// import { data } from "./assets/data";

const App = () => {
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const host = "http://localhost:8080/";
  const getAll = "Question/GetQues";
  // getAllquestions = http://localhost:8080/Question/GetQues
  const createView = "Quiz/create";
  //post request = http://localhost:8080/Quiz/create?noOfQues=5&topic=Java&title=javaQuiz
  const getView = "Quiz/get";
  //get request = http://localhost:8080/Quiz/get/6
  const deleteView = "Quiz/Finish/";
  //finish view = http://localhost:8080/Quiz/Finish/6
  const addQues = "Question/addQues";
  //post request with body = http://localhost:8080/Question/addQues
  //   {
  //     "questionTitle": "What is the purpose of the subnet mask in IP addressing?",
  //     "option1": "Identify the network portion of an IP address",
  //     "option2": "Encrypt the IP address",
  //     "option3": "Map MAC addresses to IP addresses",
  //     "option4": "Route traffic between networks",
  //     "correctAnswer": "1",
  //     "difficultyLevel": "medium",
  //     "topicName": "Computer Network"
  // }

  // Fetch data in useEffect to avoid unnecessary re-renders

  return (
    <Router>
      <Route exact path="/" component={Head} />
      <Route exact path="/quiz" component={Quiz} />
      <Route exact path="/add-question" component={QuestionForm} />
    </Router>
  );
};

export default App;
