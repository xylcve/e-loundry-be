const joi = require("joi");
const { response } = require("../../utility/response");
const { insertNeedSolvingData } = require("../websockets/notifs");
const { NotifModel } = require("../models/notifs");
const { WashingModel } = require("../models/washings");

const consumeRfidCheckInWashingGate = async (req, res) => {
    try {
        const schema = joi.object({
            batch: joi.array().items(joi.string()).min(1).required()
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, `[Bad Request] ${error.message}`); }

        const { batch } = req.body;

        const result = await WashingModel.checkInWashingGate(batch)

        return response(res, 200, '[Success]', result);
    } catch (error) {
        return response(res, 500, `[Internal Server Error] ${error.message}`);
    }
}

const consumeRfidCheckOutWashingGate = async (req, res) => {
    try {
        const schema = joi.object({
            batch: joi.array().items(joi.string()).min(1).required()
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, `[Bad Request] ${error.message}`); }

        const { batch } = req.body;

        const result = await WashingModel.checkOutWashingGate(batch)

        return response(res, 200, '[Success]', result);
    } catch (error) {
        return response(res, 500, `[Internal Server Error] ${error.message}`);
    }
}

const consumeRfidNeedSolving = async (req, res) => {
    try {
        const schema = joi.object({
            batch: joi.array().items(joi.string()).min(1).required()
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, `[Bad Request] ${error.message}`); }

        const { batch } = req.body;

        const result = await NotifModel.NeedSolvingData(batch)
        insertNeedSolvingData(result)

        return response(res, 200, '[Success]');
    } catch (error) {
        return response(res, 500, `[Internal Server Error] ${error.message}`);
    }
}

module.exports = { consumeRfidCheckInWashingGate, consumeRfidCheckOutWashingGate, consumeRfidNeedSolving }