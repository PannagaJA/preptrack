const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authmiddleware');
const Roadmap = require('../models/Roadmap');

// Get all roadmap topics
router.get('/topics', authMiddleware, async (req, res) => {
  try {
    const topics = await Roadmap.getTopics();
    const userProgress = await Roadmap.getUserProgress(req.user.id);
    const stepProgressPromises = topics.map(topic => 
      Roadmap.getStepProgress(req.user.id, topic.title)
    );
    const stepProgressResults = await Promise.all(stepProgressPromises);
    
    // Merge topics with user progress
    const topicsWithProgress = topics.map((topic, index) => {
      const progress = userProgress.find(p => p.topic === topic.title) || {};
      const stepProgress = stepProgressResults[index] || [];
      
      // Calculate overall progress based on completed steps
      const totalSteps = topic.steps.length;
      const completedSteps = stepProgress.filter(step => step.completed).length;
      const calculatedProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
      
      // Prefer calculated progress from step completion as it's more accurate
      const finalProgress = calculatedProgress;
      
      return {
        ...topic,
        userProgress: finalProgress,
        completed: completedSteps === totalSteps,
        stepProgress: stepProgress,
        completedStepsCount: completedSteps
      };
    });

    res.json({
      success: true,
      topics: topicsWithProgress
    });

  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching roadmap topics: ' + error.message
    });
  }
});

// Get specific roadmap by title
router.get('/:title', authMiddleware, async (req, res) => {
  try {
    const { title } = req.params;
    const roadmap = await Roadmap.getRoadmapByTitle(decodeURIComponent(title));
    
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        error: 'Roadmap not found'
      });
    }
    
    // Get step progress for this roadmap
    const stepProgress = await Roadmap.getStepProgress(req.user.id, roadmap.title);
    
    res.json({
      success: true,
      roadmap: {
        ...roadmap,
        stepProgress: stepProgress
      }
    });

  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching roadmap: ' + error.message
    });
  }
});

// Update progress
router.post('/progress', authMiddleware, async (req, res) => {
  try {
    const { topic, progress, completed } = req.body;

    const updatedProgress = await Roadmap.updateProgress(
      req.user.id,
      topic,
      progress,
      completed
    );

    res.json({
      success: true,
      message: 'Progress updated successfully',
      progress: updatedProgress
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating progress: ' + error.message
    });
  }
});

// NEW ROUTE: Update step progress
router.post('/step-progress', authMiddleware, async (req, res) => {
  try {
    const { topic, stepIndex, stepDescription, completed } = req.body;

    const updatedStepProgress = await Roadmap.updateStepProgress(
      req.user.id,
      topic,
      stepIndex,
      stepDescription,
      completed
    );

    // Also update overall topic progress
    const roadmap = await Roadmap.getRoadmapByTitle(topic);
    if (roadmap) {
      const stepProgress = await Roadmap.getStepProgress(req.user.id, topic);
      const totalSteps = roadmap.steps.length;
      const completedSteps = stepProgress.filter(step => step.completed).length;
      const overallProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
      const isCompleted = completedSteps === totalSteps;
      
      await Roadmap.updateProgress(
        req.user.id,
        topic,
        overallProgress,
        isCompleted
      );
    }

    res.json({
      success: true,
      message: 'Step progress updated successfully',
      stepProgress: updatedStepProgress
    });

  } catch (error) {
    console.error('Update step progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating step progress: ' + error.message
    });
  }
});

module.exports = router;