const express = require('express');
const router = express.Router();
const { getObservations, getGroups, getStats, addObservation, likeObservation } = require('../services/community-service');

router.get('/', (req, res) => {
  try {
    const filters = {
      country: req.query.country,
      city: req.query.city,
      type: req.query.type,
      severity: req.query.severity,
      limit: parseInt(req.query.limit) || 20
    };
    const data = getObservations(filters);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch observations' });
  }
});

router.get('/stats', (req, res) => {
  try {
    const stats = getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/groups', (req, res) => {
  try {
    const filters = { country: req.query.country };
    const data = getGroups(filters);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

router.post('/observe', (req, res) => {
  try {
    const { city, type, author, authorGender, content, crop, severity } = req.body;
    if (!city || !content) {
      return res.status(400).json({ error: 'city and content are required' });
    }
    const obs = addObservation({ city, type, author, authorGender, content, crop, severity });
    res.status(201).json(obs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add observation' });
  }
});

router.post('/like/:id', (req, res) => {
  try {
    const obs = likeObservation(req.params.id);
    if (!obs) return res.status(404).json({ error: 'Observation not found' });
    res.json(obs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like observation' });
  }
});

module.exports = router;
