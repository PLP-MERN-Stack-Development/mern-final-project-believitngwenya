const express = require('express');
const Mentor = require('/models/Mentor');
const User = require('/models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all mentors
router.get('/', async (req, res) => {
  try {
    const { expertise, availability, page = 1, limit = 10 } = req.query;
    let filter = { isAcceptingMentees: true };

    if (expertise) filter['expertise.category'] = expertise;
    if (availability) filter.availability = availability;

    const mentors = await Mentor.find(filter)
      .populate('user', 'name profile email')
      .populate('currentMentees', 'name profile')
      .sort({ 'rating.average': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Mentor.countDocuments(filter);

    res.json({
      mentors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentors' });
  }
});

// Get single mentor
router.get('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('user', 'name profile email')
      .populate('currentMentees', 'name profile')
      .populate('rating.reviews.user', 'name profile');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentor' });
  }
});

// Apply to become a mentor (protected)
router.post('/apply', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (user.role === 'mentor') {
      return res.status(400).json({ message: 'You are already a mentor' });
    }

    // Update user role
    user.role = 'mentor';
    await user.save();

    // Create mentor profile
    const mentor = new Mentor({
      user: user._id,
      expertise: req.body.expertise,
      experience: req.body.experience,
      availability: req.body.availability
    });

    await mentor.save();
    await mentor.populate('user', 'name profile email');

    res.status(201).json({ 
      message: 'Mentor application submitted successfully',
      mentor 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting mentor application' });
  }
});

// Add review for mentor (protected)
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const { rating, comment } = req.body;

    // Check if user already reviewed
    const existingReview = mentor.rating.reviews.find(
      review => review.user.toString() === req.user.userId
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this mentor' });
    }

    // Add new review
    mentor.rating.reviews.push({
      user: req.user.userId,
      rating,
      comment
    });

    // Update average rating
    const totalRating = mentor.rating.reviews.reduce((sum, review) => sum + review.rating, 0);
    mentor.rating.average = totalRating / mentor.rating.reviews.length;
    mentor.rating.count = mentor.rating.reviews.length;

    await mentor.save();
    res.json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
});

module.exports = router;