
require("dotenv").config();
const { response } = require('../../utility/response');
const joi = require('joi');
const { LinenTypesModel } = require("../models/linen_types");

const getLinenTypes = async (req, res) => {
    try {
        const resp = await LinenTypesModel.getAllLinenTypes()
        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const createLinenTypes = async (req, res) => {
    try {
        const schema = joi.object({
            type: joi.string().required()
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, error.message); }

        const { type } = req.body;

        const resp = await LinenTypesModel.createLinenType(type)

        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const updateLinenTypes = async (req, res) => {
    try {
        const schema = joi.object({
            id: joi.number().required(),
            fields: joi.object({
                type: joi.string().optional(),
            }).required()
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, error.message); }

        const { id, fields } = req.body;
        const { type } = fields;

        const resp = await LinenTypesModel.updateLinenType(id, type)

        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const deleteLinenTypes = async (req, res) => {
    try {
        const schema = joi.object({
            id: joi.number().required()
        });
        const { error } = schema.validate(req.body);
        if (error) { return response(res, 400, error.message); }

        const { id } = req.body;

        const resp = await LinenTypesModel.deleteLinenType(id)
        if (resp.affectedRows == 0) {
            throw new Error("Linen type not found!")
        }

        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

module.exports = { getLinenTypes, createLinenTypes, updateLinenTypes, deleteLinenTypes }