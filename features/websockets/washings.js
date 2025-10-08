const { Socket } = require("socket.io");
const { log } = require("../../middleware/logger");
const { decodeToken } = require("../../middleware/verify_jwt");
const { WashingModel } = require("../models/washings");

/**
 * 
 * @param {Socket} socket 
 */
const checkInRoom = (socket) => {
    // auth token is for postman, header access token is for react
    const token = socket.handshake.auth.token || socket.handshake.headers.access_token;
    const decodedToken = decodeToken(token)
    if (decodedToken == null) {
        log(`Websocket invalid credentials detected on check_in`);
        socket.disconnect();
    } else {
        log(`User with ID ${decodedToken.id} and role ${decodedToken.role} connected to socket check_in ${socket.id}`);
    }

    socket.on("request", async (msg) => {
        try {
            await WashingModel.checkInRoom(msg.rfid, msg.id_room)
            socket.emit('response', { rfid: msg.rfid, is_success: true, msg: "[Success] Check in success" })
            log(`Check In RFID ${msg.rfid} by id_user ${decodedToken.id} [Success]`)
        } catch (error) {
            const splitted = error.toString().split("Error: ").reverse()
            socket.emit('response', { rfid: msg.rfid, is_success: false, msg: `[Error] ${splitted[0]}` })
            log(`Check In RFID ${msg.rfid} by id_user ${decodedToken.id} ${error.toString()}`)
        }
    })

    socket.on("disconnect", (reason) => {
        log(`User ${socket.id} disconnected with reason: ${reason}`);
    });
}

/**
 * 
 * @param {Socket} socket 
 */
const checkOutRoom = (socket) => {
    // auth token is for postman, header access token is for react
    const token = socket.handshake.auth.token || socket.handshake.headers.access_token;
    const decodedToken = decodeToken(token)
    if (decodedToken == null) {
        log(`Websocket invalid credentials detected on check_out`);
        socket.disconnect();
    } else {
        log(`User with ID ${decodedToken.id} and role ${decodedToken.role} connected to socket check_out ${socket.id}`);
    }

    socket.on("request", async (rfid) => {
        try {
            await WashingModel.checkOutRoom(rfid)
            socket.emit('response', { rfid: rfid, is_success: true, msg: "[Success] Check in success" })
            log(`Check Out RFID ${rfid} by id_user ${decodedToken.id} [Success]`)
        } catch (error) {
            const splitted = error.toString().split("Error: ").reverse()
            socket.emit('response', { rfid: rfid, is_success: false, msg: `[Error] ${splitted[0]}` })
            log(`Check Out RFID ${rfid} by id_user ${decodedToken.id} ${error.toString()}`)
        }
    })

    socket.on("disconnect", (reason) => {
        log(`User ${socket.id} disconnected with reason: ${reason}`);
    });
}

module.exports = { checkInRoom, checkOutRoom }