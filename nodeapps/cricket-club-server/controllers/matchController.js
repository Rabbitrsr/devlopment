const db = require('../config/db'); // Assuming your database connection is in config/db.js
const { body, validationResult } = require('express-validator');

// 📌 Add Match
exports.addMatch = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { team1_id, team2_id, match_date, venue } = req.body;

    try {
        await db.query(
            `INSERT INTO matches (team1_id, team2_id, match_date, venue)
             VALUES ($1, $2, $3, $4)`,
            [team1_id, team2_id, match_date, venue]
        );
        res.status(201).json({ message: 'Match added successfully' });
    } catch (err) {
        console.error('Error adding match:', err);
        res.status(500).json({ message: err.message });
    }
};

// 📌 Get All Matches
exports.getMatches = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT matches.*, 
                    t1.name AS team1_name, 
                    t2.name AS team2_name
             FROM matches
             LEFT JOIN teams t1 ON matches.team1_id = t1.id
             LEFT JOIN teams t2 ON matches.team2_id = t2.id
             ORDER BY matches.match_date DESC`
        );

        res.json(result.rows);

    } catch (err) {
        console.error('Error fetching matches:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getLiveMatches = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT
                 m.id AS match_id,
                 m.team1_id,
                 m.team2_id,
                 t1.name AS team1_name,
                 t2.name AS team2_name,
                 mi.score,
                 mi.overs,
                 mi.batting_team_id,
                 m.status,
                 m.result_text,
                 m.is_live,
                 m.is_completed
             FROM matches m
                      JOIN teams t1 ON m.team1_id = t1.id
                      JOIN teams t2 ON m.team2_id = t2.id
                      LEFT JOIN match_innings mi ON m.id = mi.match_id
             WHERE m.is_live = false OR m.is_completed = true
             ORDER BY m.id DESC`
        );

        const formatted = result.rows.map(row => {
            let battingTeamName = '';

            if (row.batting_team_id === row.team1_id) {
                battingTeamName = row.team1_name;
            } else if (row.batting_team_id === row.team2_id) {
                battingTeamName = row.team2_name;
            }

            return {
                id: row.match_id,
                matchId: row.match_id,
                team1: { name: row.team1_name },
                team2: { name: row.team2_name },
                score: row.score && row.overs ? `${battingTeamName} ${row.score} (${row.overs})` : '',
                status: row.is_live
                    ? `Live - ${row.result_text || ''}`
                    : row.is_completed
                        ? 'Match Finished'
                        : row.status || ''
            };
        });

        res.json(formatted);
    } catch (err) {
        console.error('Error fetching live matches:', err);
        res.status(500).json({ message: 'Failed to fetch live matches' });
    }
};

exports.getMatchesFromID = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT matches.*, 
                    t1.name AS team1_name, 
                    t2.name AS team2_name
             FROM matches
             LEFT JOIN teams t1 ON matches.team1_id = t1.id
             LEFT JOIN teams t2 ON matches.team2_id = t2.id
             ORDER BY matches.match_date DESC`
        );

        res.json(result.rows);

    } catch (err) {
        console.error('Error fetching matches:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.setupInningsState = async (req, res) => {
    const {
        matchId,
        toss,
        battingTeamId,
        bowlingTeamId,
        team1XI,
        team2XI
    } = req.body;

    try {
        // Check if already exists
        const existing = await db.query(
            `SELECT id FROM match_inning_state WHERE match_id = $1`,
            [matchId]
        );

        if (existing.rows.length > 0) {
            // Update existing
            await db.query(
                `UPDATE match_inning_state SET
                                               toss_winner_team_id = $1,
                                               toss_decision = $2,
                                               batting_team_id = $3,
                                               bowling_team_id = $4,
                                               team1_playing_xi = $5,
                                               team2_playing_xi = $6,
                                               updated_at = NOW()
                 WHERE match_id = $7`,
                [
                    toss.teamId,
                    toss.decision,
                    battingTeamId,
                    bowlingTeamId,
                    team1XI,
                    team2XI,
                    matchId
                ]
            );
            return res.json({ message: "Match setup updated successfully" });
        } else {
            // Insert new
            await db.query(
                `INSERT INTO match_inning_state (
                    match_id,
                    toss_winner_team_id,
                    toss_decision,
                    batting_team_id,
                    bowling_team_id,
                    team1_playing_xi,
                    team2_playing_xi
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    matchId,
                    toss.teamId,
                    toss.decision,
                    battingTeamId,
                    bowlingTeamId,
                    team1XI,
                    team2XI
                ]
            );
            return res.json({ message: "Match setup saved successfully" });
        }
    } catch (err) {
        console.error("Error setting up match inning state:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

exports.getStatus = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Fetch match and team names
        const matchResult = await db.query(
            `SELECT m.*,
                    t1.name AS team1_name,
                    t2.name AS team2_name
             FROM matches m
                      LEFT JOIN teams t1 ON m.team1_id = t1.id
                      LEFT JOIN teams t2 ON m.team2_id = t2.id
             WHERE m.id = $1`,
            [id]
        );

        if (matchResult.rows.length === 0) {
            return res.status(404).json({ message: "Match not found" });
        }

        const match = matchResult.rows[0];

        // 2. Fetch toss + innings setup
        const stateResult = await db.query(
            `SELECT toss_winner_team_id, toss_decision, batting_team_id, bowling_team_id,
                    team1_playing_xi, team2_playing_xi
             FROM match_inning_state
             WHERE match_id = $1`,
            [id]
        );

        const state = stateResult.rows[0] || {};

        // 3. Flags to identify completion
        const isTossDone =
            state.toss_winner_team_id &&
            state.batting_team_id &&
            state.bowling_team_id;

        const isPlayingXISet =
            Array.isArray(state.team1_playing_xi) &&
            state.team1_playing_xi.length > 0 &&
            Array.isArray(state.team2_playing_xi) &&
            state.team2_playing_xi.length > 0;

        const isSetupComplete = isTossDone && isPlayingXISet;

        // 4. Final response
        res.json({
            ...match,
            setupStatus: {
                isSetupComplete,
                toss_winner_team_id: state.toss_winner_team_id || null,
                toss_decision: state.toss_decision || null,
                batting_team_id: state.batting_team_id || null,
                bowling_team_id: state.bowling_team_id || null,
                team1_playing_xi: state.team1_playing_xi || [],
                team2_playing_xi: state.team2_playing_xi || [],
                status: state.status || null,
            },
        });
    } catch (err) {
        console.error("Error fetching match status:", err);
        res.status(500).json({ message: err.message });
    }
};

// 📌 Update Match
exports.updateMatch = async (req, res) => {
    const { id } = req.params;
    const { team1_id, team2_id, match_date, venue, status, result_text, is_live, is_completed } = req.body;
    try {
        const existing = await db.query('SELECT * FROM matches WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: 'Match not found' });
        }

        await db.query(
            `UPDATE matches SET 
              team1_id = $1, 
              team2_id = $2, 
              match_date = $3, 
              venue = $4, 
              status = $5, 
              result_text = $6, 
              is_live = $7, 
              is_completed = $8, 
              updated_at = CURRENT_TIMESTAMP
             WHERE id = $9`,
            [team1_id, team2_id, match_date, venue, status, result_text, is_live, is_completed, id]
        );

        res.json({ message: 'Match updated successfully' });

    } catch (err) {
        console.error('Error updating match:', err);
        res.status(500).json({ message: err.message });
    }
};

// 📌 Delete Match
exports.deleteMatch = async (req, res) => {
    const { id } = req.params;

    try {
        const existing = await db.query('SELECT * FROM matches WHERE id = $1', [id]);
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: 'Match not found' });
        }

        await db.query('DELETE FROM matches WHERE id = $1', [id]);
        res.json({ message: 'Match deleted successfully' });
    } catch (err) {
        console.error('Error deleting match:', err);
        res.status(500).json({ message: err.message });
    }
};
