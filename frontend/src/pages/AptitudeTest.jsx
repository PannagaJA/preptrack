import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AptitudeTest = () => {
  const [domain, setDomain] = useState('Programming');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [loading, setLoading] = useState(false);
  const [reviewMode, setReviewMode] = useState(false); // New state for review mode
  const { user } = useAuth();

  // Reset timer when domain changes
  useEffect(() => {
    setTimeLeft(900); // Reset to 15 minutes
    setReviewMode(false); // Exit review mode when domain changes
  }, [domain]);

  useEffect(() => {
    fetchQuestions();
  }, [domain]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !showResult && questions.length > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult && questions.length > 0) {
      handleSubmit();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, showResult, questions, domain]);

  const fetchQuestions = async () => {
  setLoading(true);
  try {
    // Request 15 questions - map domain to category
    const categoryMap = {
      'Programming': 'technical',
      'Quantitative': 'quantitative',
      'Logical': 'logical'
    };
    
    const response = await axios.get(`/api/aptitude/questions?category=${categoryMap[domain] || 'all'}&limit=15`);
    setQuestions(response.data.questions || []);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(0);
    setShowResult(false);
    setReviewMode(false); // Exit review mode when starting new test
    // setTimeLeft is handled by the domain change useEffect
  } catch (error) {
    console.error('Error fetching questions:', error);
    alert('Failed to load questions. Please try again.');
  }
  setLoading(false);
};
  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    let calculatedScore = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct_answer) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    setShowResult(true);

    // Calculate time taken, ensuring it's never negative
    const timeTaken = Math.max(0, 900 - timeLeft);

    // Submit results to backend
    try {
      await axios.post('/api/aptitude/results', {
        test_type: 'aptitude',
        domain,
        score: calculatedScore,
        totalQuestions: questions.length,
        timeTaken: timeTaken
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculatePercentage = () => {
    return questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return { message: 'Excellent! 🎉', color: 'success' };
    if (percentage >= 70) return { message: 'Great job! 👍', color: 'primary' };
    if (percentage >= 50) return { message: 'Good effort! 💪', color: 'info' };
    return { message: 'Keep practicing! 📚', color: 'warning' };
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading {domain} questions...</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = calculatePercentage();
    const performance = getPerformanceMessage(percentage);

    return (
      <div className="container mt-4">
        <div className="card shadow">
          <div className="card-body text-center p-5">
            <div className={`bg-${performance.color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4`}
                 style={{ width: '100px', height: '100px' }}>
              <i className={`bi bi-${percentage >= 70 ? 'trophy' : 'award'} display-4 text-${performance.color}`}></i>
            </div>
            
            <h3 className="text-primary">Test Completed!</h3>
            <p className="lead text-muted mb-4">{performance.message}</p>
            
            <div className="row justify-content-center mb-4">
              <div className="col-md-8">
                <div className="card bg-light">
                  <div className="card-body">
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="display-6 fw-bold text-primary">{score}/{questions.length}</div>
                        <small className="text-muted">Score</small>
                      </div>
                      <div className="col-4">
                        <div className="display-6 fw-bold text-success">{percentage}%</div>
                        <small className="text-muted">Percentage</small>
                      </div>
                      <div className="col-4">
                        <div className="display-6 fw-bold text-info">{formatTime(Math.max(0, 900 - timeLeft))}</div>
                        <small className="text-muted">Time Taken</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-2">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setReviewMode(false);
                  fetchQuestions();
                }}
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Take Another Test
              </button>
              <button 
                className="btn btn-outline-primary"
                onClick={() => {
                  setShowResult(false);
                  setReviewMode(true);
                  setCurrentQuestion(0);
                }}
              >
                <i className="bi bi-eye me-2"></i>
                Review Answers
              </button>
              <a href="/leaderboard" className="btn btn-success">
                <i className="bi bi-trophy me-2"></i>
                View Leaderboard
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion] || {};

  // Show review mode if enabled
  if (reviewMode && questions.length > 0) {
    return (
      <div className="container mt-4">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h4 className="mb-0">
                  <i className="bi bi-question-circle me-2"></i>
                  {domain} Aptitude Test - Review
                </h4>
                <small>Question {currentQuestion + 1} of {questions.length}</small>
              </div>
              <div className="col-md-6 text-end">
                <button 
                  className="btn btn-light"
                  onClick={() => setReviewMode(false)}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Exit Review
                </button>
              </div>
            </div>
          </div>
          
          <div className="card-body">
            <div className="question-header mb-4">
              <h5 className="card-title text-dark">{question.question_text}</h5>
              {question.difficulty && (
                <span className={`badge ${
                  question.difficulty === 'Easy' ? 'bg-success' :
                  question.difficulty === 'Medium' ? 'bg-warning' : 'bg-danger'
                }`}>
                  {question.difficulty}
                </span>
              )}
            </div>
            
            <div className="options-container">
              {['A', 'B', 'C', 'D'].map(option => {
                const optionKey = `option_${option.toLowerCase()}`;
                const isSelected = selectedAnswers[question.id] === option;
                const isCorrect = question.correct_answer === option;
                
                let optionClass = "form-check mb-3 p-3 border rounded";
                if (isSelected && isCorrect) {
                  optionClass += " border-success bg-success bg-opacity-10";
                } else if (isSelected && !isCorrect) {
                  optionClass += " border-danger bg-danger bg-opacity-10";
                } else if (isCorrect) {
                  optionClass += " border-success bg-success bg-opacity-25";
                }
                
                return (
                  question[optionKey] && (
                    <div key={option} className={optionClass}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`question-${question.id}`}
                          id={`option-${option}`}
                          value={option}
                          checked={isSelected}
                          disabled
                        />
                        <label className="form-check-label w-100" htmlFor={`option-${option}`}>
                          <div className="d-flex justify-content-between">
                            <span>
                              <strong>{option}.</strong> {question[optionKey]}
                            </span>
                            {isSelected && isCorrect && (
                              <span className="text-success">
                                <i className="bi bi-check-circle-fill"></i> Your Answer
                              </span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="text-danger">
                                <i className="bi bi-x-circle-fill"></i> Your Answer
                              </span>
                            )}
                            {!isSelected && isCorrect && (
                              <span className="text-success">
                                <i className="bi bi-check-circle-fill"></i> Correct Answer
                              </span>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  )
                );
              })}
            </div>
            
            <div className="mt-3">
              <div className="alert alert-info">
                <h6 className="alert-heading">Explanation:</h6>
                <p className="mb-0">
                  The correct answer is <strong>Option {question.correct_answer}</strong>. 
                  {selectedAnswers[question.id] === question.correct_answer
                    ? " You selected the correct answer!" 
                    : ` You selected Option ${selectedAnswers[question.id] || 'None'}.`}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card-footer">
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-outline-primary"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Previous
              </button>
              
              <div className="text-muted small">
                {Object.keys(selectedAnswers).length}/{questions.length} answered
              </div>
              
              <button
                className="btn btn-primary"
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={currentQuestion === questions.length - 1}
              >
                Next Question
                <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="progress" style={{ height: '10px' }}>
            {questions.map((question, index) => (
              <div
                key={index}
                className={`progress-bar ${
                  index === currentQuestion ? 'bg-warning' :
                  selectedAnswers[question?.id] ? 'bg-success' : 'bg-light'
                }`}
                style={{ width: `${100 / questions.length}%` }}
                title={`Question ${index + 1}`}
              ></div>
            ))}
          </div>
          <div className="d-flex justify-content-between mt-1">
            <small className="text-muted">Progress</small>
            <small className="text-muted">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
            </small>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the question section if there are no questions
  if (questions.length === 0) {
    return (
      <div className="container mt-4">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h4 className="mb-0">
                  <i className="bi bi-question-circle me-2"></i>
                  {domain} Aptitude Test
                </h4>
              </div>
              <div className="col-md-6 text-end">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <div className="fw-bold fs-5 text-warning">
                    <i className="bi bi-clock me-1"></i>
                    {formatTime(timeLeft)}
                  </div>
                  <select 
                    className="form-select form-select-sm w-auto"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    disabled={loading}
                  >
                    <option value="Programming">Programming</option>
                    <option value="Quantitative">Quantitative</option>
                    <option value="Logical">Logical</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-body text-center py-5">
            <div className="text-center py-4">
              <i className="bi bi-question-circle text-muted display-1"></i>
              <h4 className="mt-3">No Questions Available</h4>
              <p className="text-muted mb-4">Please try another domain or check back later.</p>
              <button className="btn btn-primary" onClick={() => {
                setReviewMode(false);
                fetchQuestions();
              }}>
                <i className="bi bi-arrow-repeat me-2"></i>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h4 className="mb-0">
                <i className="bi bi-question-circle me-2"></i>
                {domain} Aptitude Test
              </h4>
              <small>Question {currentQuestion + 1} of {questions.length}</small>
            </div>
            <div className="col-md-6 text-end">
              <div className="d-flex align-items-center justify-content-end gap-3">
                <div className="fw-bold fs-5 text-warning">
                  <i className="bi bi-clock me-1"></i>
                  {formatTime(timeLeft)}
                </div>
                <select 
                  className="form-select form-select-sm w-auto"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={loading}
                >
                  <option value="Programming">Programming</option>
                  <option value="Quantitative">Quantitative</option>
                  <option value="Logical">Logical</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <div className="question-header mb-4">
            <h5 className="card-title text-dark">{question.question_text || 'Loading question...'}</h5>
            {question.difficulty && (
              <span className={`badge ${
                question.difficulty === 'Easy' ? 'bg-success' :
                question.difficulty === 'Medium' ? 'bg-warning' : 'bg-danger'
              }`}>
                {question.difficulty}
              </span>
            )}
          </div>
          
          <div className="options-container">
            {['A', 'B', 'C', 'D'].map(option => (
              question[`option_${option.toLowerCase()}`] && (
                <div key={option} className="form-check mb-3 p-3 border rounded hover-shadow">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${question.id || currentQuestion}`}
                    id={`option-${option}`}
                    value={option}
                    checked={selectedAnswers[question.id] === option}
                    onChange={() => handleAnswerSelect(question.id, option)}
                    disabled={!question.id}
                  />
                  <label className="form-check-label w-100" htmlFor={`option-${option}`}>
                    <strong>{option}.</strong> {question[`option_${option.toLowerCase()}`]}
                  </label>
                </div>
              )
            ))}
          </div>
        </div>
        
        <div className="card-footer">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-outline-primary"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            >
              <i className="bi bi-arrow-left me-1"></i>
              Previous
            </button>
            
            <div className="text-muted small">
              {Object.keys(selectedAnswers).length}/{questions.length} answered
            </div>
            
            {currentQuestion === questions.length - 1 ? (
              <button
                className="btn btn-success"
                onClick={handleSubmit}
              >
                Submit Test
                <i className="bi bi-check-lg ms-1"></i>
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                disabled={!selectedAnswers[question.id] || !question.id}
              >
                Next Question
                <i className="bi bi-arrow-right ms-1"></i>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      {questions.length > 0 && (
        <div className="mt-3">
          <div className="progress" style={{ height: '10px' }}>
            {questions.map((question, index) => (
              <div
                key={index}
                className={`progress-bar ${
                  index === currentQuestion ? 'bg-warning' :
                  selectedAnswers[question?.id] ? 'bg-success' : 'bg-light'
                }`}
                style={{ width: `${100 / questions.length}%` }}
                title={`Question ${index + 1}`}
              ></div>
            ))}
          </div>
          <div className="d-flex justify-content-between mt-1">
            <small className="text-muted">Progress</small>
            <small className="text-muted">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default AptitudeTest;