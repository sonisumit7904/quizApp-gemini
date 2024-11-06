import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Head.css";
import ImageCard from "./ImageCard";
import axios from "axios";
import QuizTopics from "./QuizTopics";
import { useDispatch } from "react-redux";

const Head = () => {
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const api_url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;
  const history = useHistory();

  // State to track the selected card and selected topic
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(false);

  const quizSet = [
    {
      difficulty: "Easy",
      desc: "Time : 10 sec",
      questions: 12,
    },
    {
      difficulty: "Medium",
      desc: "Time : 10 sec",
      questions: 10,
    },
    {
      difficulty: "Hard",
      desc: "Time : 10 sec",
      questions: 5,
    },
  ];

  const quizSubject = ["Java", "Operating System", "Computer Network"];

  // Create axios instance with default config
  const axiosInstance = axios.create({
    baseURL: "/Quiz", // Add /Quiz to base URL
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getresponse = async (noOfQues, topic, difficulty) => {
    const prompt = `Generate ${noOfQues} ${difficulty} difficulty multiple choice questions about ${topic}.
    Each question should include:
    - A clear question title
    - 4 distinct answer options
    - The correct answer marked as "1", "2", "3", or "4" corresponding to the correct option
    - Difficulty level: ${difficulty}
    - Topic name: ${topic}
    
    Format the response as a JSON array where each question follows the exact schema provided.`;

    const response = await axiosInstance.post(
      api_url,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          response_mime_type: "application/json",
          response_schema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              required: [
                "questionTitle",
                "option1",
                "option2",
                "option3",
                "option4",
                "correctAnswer",
                "difficultyLevel",
                "topicName",
              ],
              properties: {
                questionTitle: { type: "STRING" },
                option1: { type: "STRING" },
                option2: { type: "STRING" },
                option3: { type: "STRING" },
                option4: { type: "STRING" },
                correctAnswer: {
                  type: "STRING",
                  enum: ["1", "2", "3", "4"]
                },
                difficultyLevel: {
                  type: "STRING",
                  enum: ["Easy", "Medium", "Hard"],
                },
                topicName: { type: "STRING" },
              },
            },
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    try {
      const data = response.data.candidates[0].content.parts[0].text;
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      return parsedData;
    } catch (error) {
      console.error("Error parsing response:", error);
      throw new Error("Failed to generate quiz questions");
    }
  };
  // getresponse(15, "Operating System", "Easy");

  const createQuiz = async () => {
    try {
      setLoading(true);

      // Get the selected difficulty and topic
      const selectedDifficulty = quizSet[selectedCard];
      const selectedSubject = quizSubject[selectedTopic];

      const noOfQues = selectedDifficulty.questions;
      const topic = selectedSubject;
      const difficulty = selectedDifficulty.difficulty;

      // Step 1: Create the quiz with POST request using axios
      const quizData = await getresponse(noOfQues, topic, difficulty);

      localStorage.setItem(
        "currentQuiz",
        JSON.stringify({
          questions: quizData,
          difficulty: selectedDifficulty.difficulty,
          topic: selectedSubject,
        })
      );

      history.push(`/quiz`);
    } catch (error) {
      console.error(
        "Error creating quiz:",
        error.response?.data || error.message
      );
      alert("Failed to create quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const gotoForm = () => {
    history.push("/add-question");
  };

  const clickHandlerCard = (cardIndex) => {
    // If the clicked card is already selected, do nothing
    if (selectedCard === cardIndex) return;

    // Set the selected card index
    setSelectedCard(cardIndex);
  };

  const clickHandlerTopic = (topicIndex) => {
    // If the clicked topic is already selected, do nothing
    if (selectedTopic === topicIndex) return;

    // Set the selected topic index
    setSelectedTopic(topicIndex);
  };

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <hr />
      <div className="quizFlex">
        {quizSet.map((item, index) => (
          <ImageCard
            key={index}
            isSelected={selectedCard === index}
            isDisabled={selectedCard !== null && selectedCard !== index}
            onClick={() => clickHandlerCard(index)}
            quiz={item}
          />
        ))}
      </div>
      <div className="quizTopics">
        {quizSubject.map((sub, index) => (
          <QuizTopics
            key={index}
            isSelected={selectedTopic === index}
            isDisabled={selectedTopic !== null && selectedTopic !== index}
            onClick={() => clickHandlerTopic(index)}
            subject={sub}
          />
        ))}
      </div>

      <hr />
      <button
        onClick={createQuiz}
        className={`start ${
          selectedCard === null || selectedTopic === null || loading
            ? "disabled"
            : ""
        }`}
        disabled={selectedCard === null || selectedTopic === null || loading} // Disable if either is not selected
      >
        {loading ? "Creating Quiz..." : "START QUIZ"}
      </button>
      {/* <button onClick={gotoForm} className={`start`}>
        Insert Question
      </button> */}
    </div>
  );
};

export default Head;
