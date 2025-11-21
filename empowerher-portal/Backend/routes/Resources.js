const express = require('express');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all resources with filtering
router.get('/', async (req, res) => {
  try {
    const { category, type, level, search, page = 1, limit = 10 } = req.query;
    let filter = {};

    // Build filter object
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (level) filter.level = level;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(filter)
      .populate('createdBy', 'name profile')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Resource.countDocuments(filter);

    res.json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources' });
  }
});

// Get single resource
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('createdBy', 'name profile');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Increment view count
    resource.views += 1;
    await resource.save();
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resource' });
  }
});

// Create resource (protected)
router.post('/', auth, async (req, res) => {
  try {
    const resource = new Resource({
      ...req.body,
      createdBy: req.user.userId
    });

    await resource.save();
    await resource.populate('createdBy', 'name profile');
    
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error creating resource' });
  }
});

// Update resource (protected - only creator)
router.put('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.userId 
    });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found or unauthorized' });
    }

    Object.assign(resource, req.body);
    await resource.save();
    
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Error updating resource' });
  }
});

// Delete resource (protected - only creator)
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: req.user.userId 
    });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found or unauthorized' });
    }
    
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resource' });
  }
});

module.exports = router;