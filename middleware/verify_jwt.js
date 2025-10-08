const jwt = require('jsonwebtoken');
const { response } = require('../utility/response');
const { SECRET_KEY } = require('../config/config');
const { dbPool } = require('../config/initmysql');

/**
 * 
 * @param {Array.of<'Admin'|'Operator'>} roles 
 */
const verifyJwtRoles = (roles) => {
    return (req, res, next) => {
        let access_token = null;
        try {
            const token = req.headers.authorization.split(' ')
            access_token = token[1]
        } catch (error) { }

        if (access_token == null) { return response(res, 401, "[Unauthorized]") }

        try {
            const userdata = jwt.verify(access_token, SECRET_KEY);

            if (roles.length != 0) {
                const valid_role = roles.find((role) => { return role.toLowerCase() == userdata.role.toLowerCase() })
                if (valid_role == null) {
                    return response(res, 403, "[Forbidden]");
                }
            }

            req.user = userdata;
            next();
        } catch (error) {
            return response(res, 500, `[Internal Server Error] ${error.message}`);
        }
    }
}

const verifyRfidIot = async (req, res, next) => {
    let rfid_token = null
    try {
        const token = req.headers.authorization.split(' ')
        rfid_token = token[1]
    } catch (error) { }

    if (rfid_token == null) { return response(res, 401, "[Unauthorized]") }
    try {
        const [resp] = await dbPool.query(`SELECT id FROM rfid_clients WHERE token = :token`, { token: rfid_token })
        if (resp.length == 0) { return response(res, 401, "[Unauthorized]") }
        
        next()
    } catch (error) {
        return response(res, 500, `[Internal Server Error] ${error.message}`);
    }
}

const decodeToken = (access_token) => {
    try {
        return jwt.verify(access_token, SECRET_KEY);
    } catch (error) {
        return null
    }
}

module.exports = { verifyJwtRoles, verifyRfidIot, decodeToken }