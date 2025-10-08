
require("dotenv").config();
const { response } = require('../../utility/response');
const joi = require('joi');
const { RoomsModel} = require("../models/rooms");

const getRooms = async (req, res) => {
    try {
        const resp = await RoomsModel.getAllRooms()
        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const getRoomTypes = async (req, res) => {
    try {
        const resp = await RoomsModel.getAllRoomTypes()
        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const createRooms = async (req, res) => {
    try {
        const schema = joi.object({
            room: joi.string().required(),
            tipe: joi.string().required()
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, error.message); }

        const { room, tipe } = req.body;

        const resp = await RoomsModel.createRoom(room, tipe);

        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const updateRooms = async (req, res) => {
    try {
        const schema = joi.object({
            id: joi.number().required(),
            fields: joi.object({
                room: joi.string().optional(),
                tipe: joi.string().optional()
            }).required()
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, error.message); }

        const { id, fields } = req.body;
        const { room, tipe } = fields;

        const resp = await RoomsModel.updateRoom(id, room, tipe)
        if (resp.affectedRows == 0) {
            return response(res, 500, `[Internal Server Error] Room not found!`);
        }

        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const deleteRooms = async (req, res) => {
    try {
        const schema = joi.object({
            id: joi.number().required()
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, error.message); }

        const { id } = req.body;

        const resp = await RoomsModel.deleteRoom(id)
        if (resp.affectedRows == 0) {
            return response(res, 500, `[Internal Server Error] Room not found!`);
        }

        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

module.exports = { getRooms, getRoomTypes, createRooms, updateRooms, deleteRooms }