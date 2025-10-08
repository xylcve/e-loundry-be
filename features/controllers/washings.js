
require("dotenv").config();
const { response } = require('../../utility/response');
const joi = require('joi');
const { WashingModel } = require("../models/washings");

const checkOutRoom = async (req, res) => {
    try {
        const schema = joi.object({
            rfid: joi.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, `[Bad Request] ${error.message}`); }

        const { rfid } = req.body;

        await WashingModel.checkOutRoom(rfid)

        return response(res, 200, '[Success]');
    } catch (error) {
        return response(res, 500, `[Internal Server Error] ${error.message}`);
    }
}

const checkInWashingGate = async (req, res) => {
    try {
        const schema = joi.object({
            rfids: joi.array().items(joi.string()).min(1),
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, `[Bad Request] ${error.message}`); }

        const { rfids } = req.body;

        await WashingModel.checkInWashingGate(rfids)

        return response(res, 200, '[Success]');
    } catch (error) {
        return response(res, 500, `[Internal Server Error] ${error.message}`);
    }
}

const checkOutWashingGate = async (req, res) => {
    try {
        const schema = joi.object({
            rfids: joi.array().items(joi.string()).min(1),
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, `[Bad Request] ${error.message}`); }

        const { rfids } = req.body;

        await WashingModel.checkOutWashingGate(rfids)

        return response(res, 200, '[Success]');
    } catch (error) {
        return response(res, 500, `[Internal Server Error] ${error.message}`);
    }
}

const checkInRoom = async (req, res) => {
    try {
        const schema = joi.object({
            id_room: joi.number().required(),
            rfid: joi.string().required(),
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, `[Bad Request] ${error.message}`); }

        const { id_room, rfid } = req.body;

        if (isNaN(parseInt(id_room))){
            return response(res, 400, `[Bad Request] Invalid id room`);
        }

        await WashingModel.checkInRoom(rfid, id_room)

        return response(res, 200, '[Success]');
    } catch (error) {
        return response(res, 500, `[Internal Server Error] ${error.message}`);
    }
}

const getWashingDetail = async (req, res) => {
    try {
        const schema = joi.object({
            rfid: joi.string().required(),
        });
        const { error } = schema.validate(req.query);
        if (error) { return response(res, 400, `[Bad Request] ${error.message}`); }

        const { rfid } = req.query;

        const result = await WashingModel.getWashingDetail(rfid)

        return response(res, 200, '[Success]', result);
    } catch (error) {
        return response(res, 500, `[Internal Server Error] ${error.message}`);
    }
}

module.exports = { checkOutRoom, checkInWashingGate, checkOutWashingGate, checkInRoom, getWashingDetail }