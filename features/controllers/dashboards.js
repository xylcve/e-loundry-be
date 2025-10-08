require("dotenv").config();
const { response } = require('../../utility/response');
const joi = require('joi');
const { DashboardModel } = require("../models/dashboards");

const GetMaxWashedLinen = async (req, res) => {
    try {
        const resp = await DashboardModel.ActiveLinenMaxWashed()
        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const GetLinenByStatus = async (req, res) => {
    try {
        const schema = joi.object({
            start_date: joi.date().required(),
            end_date: joi.date().required()
        });
        const { error } = schema.validate(req.query);
        if (error) { return response(res, 400, error.message); }

        let { start_date, end_date } = req.query;

        start_date = new Date(start_date)
        end_date = new Date(end_date)

        const resp = await DashboardModel.LinenByStatus(start_date, end_date)
        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const GetLinenByRoomAsc = async (req, res) => {
    try {
        const schema = joi.object({
            tipe: joi.string().optional(),
        });
        const { error } = schema.validate(req.query);
        if (error) { return response(res, 400, error.message); }

        let { tipe } = req.query;
        if (tipe == '') { tipe == null }

        const resp = await DashboardModel.LinenByRoomAsc(tipe)
        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

const GetLinenByRoomDesc = async (req, res) => {
    try {
        const schema = joi.object({
            tipe: joi.string().optional(),
        });
        const { error } = schema.validate(req.query);
        if (error) { return response(res, 400, error.message); }

        let { tipe } = req.query;
        if (tipe == '') { tipe == null }

        const resp = await DashboardModel.LinenByRoomDesc(tipe)
        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

module.exports = { GetLinenByRoomAsc, GetLinenByRoomDesc, GetLinenByStatus, GetMaxWashedLinen }