const { validationResult } = require('express-validator');
const db = require('../config/db');

const multer = require('multer');
// Multer setup for banner upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/players/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});

const upload = multer({ storage: storage });
exports.uploadphoto = upload.single('photo');

// Add Player
exports.addPlayer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { team_id, player_name, player_role  } = req.body;

    const photo_url = req.file ? `/uploads/players/${req.file.filename}` : null;

    try {
        await db.query(
            'INSERT INTO players (team_id, player_name, player_role, photo_url) VALUES ($1, $2, $3, $4)',
            [team_id, player_name, player_role, photo_url]
        );
        res.status(201).json({ message: 'Player added successfully' });
    } catch (err) {
        console.error('Error adding player:', err);
        res.status(500).json({ message: err.message });
    }
};

// Update Player
exports.updatePlayer = async (req, res) => {
    const { id } = req.params;
    const { team_id, player_name, player_role  } = req.body;
    const photo_url = req.file ? `/uploads/players/${req.file.filename}` : null;
    try {
        const existing = await db.query('SELECT * FROM players WHERE id = $1', [id]);

        if (existing.rows.length === 0) {
            return res.status(404).json({ message: 'Player not found' });
        }

        await db.query(
            `UPDATE players SET
            team_id = $1,
            player_name = $2,
            player_role = $3,
            photo_url = $4,
            updated_at = CURRENT_TIMESTAMP
            WHERE id = $5`,
            [team_id, player_name, player_role, photo_url, id]
        );

        res.json({ message: 'Player updated successfully' });
    } catch (err) {
        console.error('Error updating player:', err);
        res.status(500).json({ message: err.message });
    }
};

// Get all players
exports.getPlayers = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT players.*, teams.name AS team_name 
       FROM players 
       LEFT JOIN teams ON players.team_id = teams.id
       ORDER BY players.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching players:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getPlayersByTeam = async (req, res) => {
    const { teamid } = req.params;
    try {
        const result = await db.query(
            `SELECT players.*, teams.name AS team_name
       FROM players
       LEFT JOIN teams ON players.team_id = teams.id
       WHERE players.team_id = $1
       ORDER BY players.created_at DESC`,
            [teamid]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching players:', err);
        res.status(500).json({ message: err.message });
    }
};


// Delete player
exports.deletePlayer = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM players WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json({ message: 'Player deleted successfully' });
    } catch (err) {
        console.error('Error deleting player:', err);
        res.status(500).json({ message: err.message });
    }
};
