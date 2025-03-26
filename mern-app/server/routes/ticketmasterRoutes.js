const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const TICKETMASTER_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

// search for events here, need to make a search page
router.get('/search', async (req, res) => {
    try {
        const { keyword, page = 1, size = 20 } = req.query;
        const response = await axios.get(`${TICKETMASTER_BASE_URL}/events.json`, {
            params: {
                apikey: TICKETMASTER_API_KEY,
                keyword,
                page,
                size
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error searching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// get event details by id, need to make a event details page
router.get('/events/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const response = await axios.get(`${TICKETMASTER_BASE_URL}/events/${eventId}`, {
            params: {
                apikey: TICKETMASTER_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error getting event details:', error);
        res.status(500).json({ error: 'Failed to fetch event details' });
    }
});

// sarching by city, need to make a city page
router.get('/city', async (req, res) => {
    try {
        const { city, page = 1, size = 20 } = req.query;
        const response = await axios.get(`${TICKETMASTER_BASE_URL}/events.json`, {
            params: {
                apikey: TICKETMASTER_API_KEY,
                city,
                page,
                size
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error searching events by city:', error);
        res.status(500).json({ error: 'Failed to fetch events by city' });
    }
});

module.exports = router; 