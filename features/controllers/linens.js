
require("dotenv").config();
const { response } = require('../../utility/response');
const joi = require('joi');
const { LinensModel } = require("../models/linens");

const getLinens = async (req, res) => {
    try {
        const schema = joi.object({
            from_row: joi.number().required(),
            limit: joi.number().required(),
            start_date: joi.date().optional(),
            end_date: joi.date().optional()
        });
        const { error } = schema.validate(req.query);
        if (error) { return response(res, 400, error.message); }

        const { from_row, limit, start_date, end_date } = req.query;

        const resp = await LinensModel.getAllActiveLinens(parseInt(from_row), parseInt(limit), start_date, end_date)
        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const getLinensByRoom = async (req, res) => {
    try {
        const schema = joi.object({
            from_row: joi.number().required(),
            limit: joi.number().required(),
            id_room: joi.number().required(),
        });
        const { error } = schema.validate(req.query);
        if (error) { return response(res, 400, error.message); }

        const { from_row, limit, id_room } = req.query;

        const resp = await LinensModel.getAllActiveLinenInRooms(parseInt(from_row), parseInt(limit), parseInt(id_room))
        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const createLinens = async (req, res) => {
    try {
        const schema = joi.object({
            id_room: joi.number().required(),
            rfid: joi.string().required(),
            type: joi.string().required()
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, error.message); }

        const { id_room, rfid, type } = req.body;

        const resp = await LinensModel.insertLinen(rfid, type, id_room)

        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const updateLinens = async (req, res) => {
    try {
        const schema = joi.object({
            id: joi.number().required(),
            fields: joi.object({
                id_room: joi.number().optional(),
                type: joi.string().optional(),
            }).required()
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, error.message); }

        const { id, fields } = req.body;
        const { id_room, type } = fields;

        const resp = await LinensModel.updateLinen(id, { id_room, type })

        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const disableLinens = async (req, res) => {
    try {
        const schema = joi.object({
            batch: joi.array().items(joi.string()).min(1).unique((a, b) => { return a == b }).required()
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, error.message); }

        const { batch } = req.body;

        const resp = await LinensModel.disableLinens(batch)

        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const changeRfidLinen = async (req, res) => {
    try {
        const schema = joi.object({
            old_rfid: joi.string().required(),
            new_rfid: joi.string().required()
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, error.message); }

        const { old_rfid, new_rfid } = req.body;

        if (old_rfid == new_rfid) {
            throw new Error("Old RFID is same as new RFID")
        }

        const resp = await LinensModel.changeRfidLinen(old_rfid, new_rfid)

        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

module.exports = { getLinens, getLinensByRoom, createLinens, updateLinens, disableLinens, changeRfidLinen }