# Quiz Application

## Overview

This is a modern, interactive Quiz Application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to take quizzes on various topics with different difficulty levels, and provides immediate feedback and scoring.

## Features

- Dynamic quiz generation based on topic and difficulty
- Timer for each question
- Immediate feedback on answers
- Final score display with a visual chart
- Ability to add new questions to the database
- Responsive design for various screen sizes

## Tech Stack

- AI Questions Generation: Google Gemini API
- Frontend: React.js with Vite
- Styling: CSS with responsive design
- Charts: Chart.js with react-chartjs-2
- Routing: React Router
- HTTP Client: Axios

## Project Structure

The project follows a standard React application structure with additional folders for components and styles. Key files and directories include:

- `src/`: Source code for the React application
  - `Components/`: React components
  - `assets/`: Static assets like images
  - `App.jsx`: Main application component
  - `main.jsx`: Entry point of the React application
- `vite.config.js`: Vite configuration file
- `package.json`: Project dependencies and scripts

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables - VITE_GOOGLE_API_KEY=
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. On the home page, select a difficulty level and a topic for your quiz.
2. Click "START QUIZ" to begin.
3. Answer each question within the time limit.
4. After completing the quiz, view your score and a chart of your performance.
5. You can retry the quiz or return to the main menu.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
