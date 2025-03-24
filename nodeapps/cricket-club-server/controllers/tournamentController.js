const { validationResult } = require('express-validator');
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Multer setup for banner upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/tournament-banners/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});

const upload = multer({ storage: storage });
exports.uploadBanner = upload.single('banner');

// Add Tournament API
exports.addTournament = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, place, start_date, end_date, entry_fee } = req.body;
    const bannerUrl = req.file ? `/uploads/tournament-banners/${req.file.filename}` : null;

    try {
        const existingTournament = await db.query(
            `SELECT * FROM tournaments
             WHERE title = $1
               AND place = $2
               AND (
                 (start_date <= $3 AND end_date >= $3) OR
                 (start_date <= $4 AND end_date >= $4) OR
                 ($3 <= start_date AND $4 >= end_date)
                 )`,
            [title, place, start_date, end_date]
        );

        if (existingTournament.rows.length > 0) {
            return res.status(409).json({
                message: 'A tournament with the same name and overlapping dates already exists for this location.',
            });
        }

        await db.query(
            `INSERT INTO tournaments (title, place, start_date, end_date, entry_fee, banner_url)
             VALUES ($1, $2, $3::timestamp, $4::timestamp, $5, $6)`,
            [title, place, start_date, end_date, entry_fee, bannerUrl]
        );

        res.status(201).json({ message: 'Tournament added successfully' });
    } catch (err) {
        console.error('Error adding tournament:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getTournaments = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tournaments ORDER BY start_date DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching tournaments:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.updateTournament = async (req, res) => {
    const { id } = req.params;
    const { title, place, start_date, end_date, entry_fee } = req.body;
    const bannerUrl = req.file ? `/uploads/tournament-banners/${req.file.filename}` : null;

    try {
        // Check if tournament exists
        const existing = await db.query('SELECT * FROM tournaments WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        // Update tournament
        await db.query(
            `UPDATE tournaments SET 
              title = $1, 
              place = $2, 
              start_date = $3::timestamp, 
              end_date = $4::timestamp, 
              entry_fee = $5, 
              banner_url = COALESCE($6, banner_url), 
              updated_at = CURRENT_TIMESTAMP
             WHERE id = $7`,
            [title, place, start_date, end_date, entry_fee, bannerUrl, id]
        );

        res.json({ message: 'Tournament updated successfully' });
    } catch (err) {
        console.error('Error updating tournament:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.deleteTournament = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM tournaments WHERE id = $1', [id]);
        res.json({ message: 'Tournament deleted successfully' });
    } catch (err) {
        console.error('Error deleting tournament:', err);
        res.status(500).json({ message: err.message });
    }
};