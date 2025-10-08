require("dotenv").config();
const { response } = require('../../utility/response');
const joi = require('joi');
const { NotifModel } = require("../models/notifs");

const HaventDoneWashingInCertainDays = async (req, res) => {
    try {
        const resp = await NotifModel.HaventDoneWashingInCertainDays()
        return response(res, 200, '[Success]', resp);
    } catch (error) {
        return response(res, 500, error.message);
    }
}

module.exports = { HaventDoneWashingInCertainDays }