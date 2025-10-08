const express = require('express');
const router = express.Router();
const RfidConsumer = require('../controllers/rfid_consumer.js');
const { verifyRfidIot } = require('../../middleware/verify_jwt.js');

router.post('/rfid/need_solving', verifyRfidIot, RfidConsumer.consumeRfidNeedSolving);
router.post('/rfid/check_in_gate', verifyRfidIot, RfidConsumer.consumeRfidCheckInWashingGate);
router.post('/rfid/check_out_gate', verifyRfidIot, RfidConsumer.consumeRfidCheckOutWashingGate);

module.exports = router;