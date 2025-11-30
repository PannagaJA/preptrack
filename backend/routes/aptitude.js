const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authmiddleware');
const TestResult = require('../models/TestResult');

// Sample aptitude questions
const aptitudeQuestions = [
  // Programming/Technical Questions
  {
    id: 1,
    question_text: "What is the time complexity of binary search?",
    option_a: "O(n)",
    option_b: "O(log n)",
    option_c: "O(n log n)",
    option_d: "O(1)",
    correct_answer: "B",
    type: "technical",
    difficulty: "Medium"
  },
  {
    id: 2,
    question_text: "Which data structure uses LIFO principle?",
    option_a: "Queue",
    option_b: "Array",
    option_c: "Stack",
    option_d: "Tree",
    correct_answer: "C",
    type: "technical",
    difficulty: "Easy"
  },
  {
    id: 3,
    question_text: "What does SQL stand for?",
    option_a: "Structured Query Language",
    option_b: "Standard Query Language",
    option_c: "Sequential Query Language",
    option_d: "Structured Question Language",
    correct_answer: "A",
    type: "technical",
    difficulty: "Easy"
  },
  // Quantitative Questions
  {
    id: 4,
    question_text: "If 15% of 40 is greater than 25% of a number by 2, what is the number?",
    option_a: "16",
    option_b: "12",
    option_c: "8",
    option_d: "4",
    correct_answer: "A",
    type: "quantitative",
    difficulty: "Medium"
  },
  {
    id: 5,
    question_text: "A train 150 meters long is running at a speed of 90 kmph. How long does it take to cross a bridge 300 meters long?",
    option_a: "15 seconds",
    option_b: "18 seconds",
    option_c: "20 seconds",
    option_d: "25 seconds",
    correct_answer: "B",
    type: "quantitative",
    difficulty: "Hard"
  },
  // Logical Questions
  {
    id: 6,
    question_text: "If 'BOOK' is coded as 'CPPL', how is 'PEN' coded?",
    option_a: "QFO",
    option_b: "QDM",
    option_c: "RFN",
    option_d: "QEN",
    correct_answer: "A",
    type: "logical",
    difficulty: "Medium"
  }
];

// Get aptitude questions
router.get('/questions', authMiddleware, async (req, res) => {
  const { category = 'all', difficulty = 'all', limit = 20 } = req.query;
  
  let filteredQuestions = [...aptitudeQuestions];
  
  // Filter by category
  if (category !== 'all') {
    filteredQuestions = filteredQuestions.filter(q => q.type === category);
  }
  
  // Filter by difficulty
  if (difficulty !== 'all') {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
  }
  
  // Shuffle and limit
  const shuffledQuestions = filteredQuestions.sort(() => Math.random() - 0.5).slice(0, parseInt(limit));
  
  res.json({
    success: true,
    questions: shuffledQuestions,
    total: filteredQuestions.length,
    filtered: shuffledQuestions.length
  });
});

// Submit aptitude test results
router.post('/results', authMiddleware, async (req, res) => {
  try {
    const { test_type, domain, score, totalQuestions, timeTaken } = req.body;
    
    const result = await TestResult.create({
      user_id: req.user.id,
      test_type: test_type || 'aptitude',
      score,
      total_questions: totalQuestions,
      time_taken: timeTaken,
      correct_answers: score,
      wrong_answers: totalQuestions - score
    });
    
    // Emit leaderboard update event
    const io = req.app.get('io');
    if (io) {
      io.emit('leaderboard-update', { 
        message: 'Leaderboard updated',
        userId: req.user.id,
        score: req.body.score,
        totalQuestions: req.body.totalQuestions
      });
    }
    
    res.json({
      success: true,
      message: 'Test result submitted successfully',
      result
    });
  } catch (error) {
    console.error('Error submitting test result:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit test result'
    });
  }
});

module.exports = router;