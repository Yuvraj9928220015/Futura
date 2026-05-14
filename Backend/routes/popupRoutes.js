const express = require('express');
const router = express.Router();

const {
    submitPopup,
    getAllPopups,
    getPopupById,
    updatePopupStatus,
    deletePopup,
} = require('../controllers/popupControllres');

// ─────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────

// POST /api/popup/submit  →  Frontend form submit
router.post('/submit', submitPopup);

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────

// GET  /api/popup/all         →  Sabhi entries
router.get('/all', getAllPopups);

// GET  /api/popup/:id         →  Single entry
router.get('/:id', getPopupById);

// PATCH /api/popup/:id/status →  Status update
router.patch('/:id/status', updatePopupStatus);

// DELETE /api/popup/:id       →  Delete entry
router.delete('/:id', deletePopup);

module.exports = router;