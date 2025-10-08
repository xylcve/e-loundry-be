const { Socket, Server } = require("socket.io");
const { log } = require("../../middleware/logger");
const { decodeToken } = require("../../middleware/verify_jwt");
const { NotifModel } = require("../models/notifs");

/**
 * @type {{
 * id_linen: number;
 * rfid: string;
 * type: string;
 * wash_status: string;
 * last_wash_room: string;
 * last_wash_start: string;
 * }[]}
 */
let need_washings = []

/**
 * @type {{
 * id_linen: number;
 * rfid: string;
 * type: string;
 * room: string;
 * }[]}
 */
let need_solving = []

/**
 * @type {Server?}
 */
let ServerIO

/**
 * 
 * @param {Server} io 
 */
const setNotifServerIO = (io) => { ServerIO = io }

/**
 * 
 * @param {{
* id_linen: number;
* rfid: string;
* type: string;
* room: string;
* }[]} rfids
*/
const insertNeedSolvingData = (rfids) => {
    for (let i = 0; i < rfids.length; i++) {
        need_solving.push(rfids[i])
    }
    broadcastNotificationNeedSolving(ServerIO, need_solving)
}

/**
 * 
 * @param {string} rfid 
 */
const removeNeedSolvingData = (rfid) => {
    let data = []
    for (let i = 0; i < need_solving.length; i++) {
        if (need_solving[i].rfid == rfid) { continue }
        data.push(need_solving[i])
    }
    need_solving = data
    broadcastNotificationNeedSolving(ServerIO, need_solving)
}


/**
 * 
 * @param {Socket} socket 
 */
const notificationSocket = (socket) => {
    // auth token is for postman, header access token is for react
    const token = socket.handshake.auth.token || socket.handshake.headers.access_token;
    const decodedToken = decodeToken(token)
    if (decodedToken == null) {
        log(`Websocket invalid credentials detected on notification`);
        socket.disconnect();
    } else {
        log(`User with ID ${decodedToken.id} and role ${decodedToken.role} connected to socket notification ${socket.id}`);
    }

    socket.on("initial", async () => {
        socket.emit("need_washing", need_washings)
        socket.emit("need_solving", need_solving)
    })

    socket.on("solve_rfid", (rfid) => {
        if (typeof rfid != "string") {
            socket.emit("response", `RFID ${rfid} invalid`)
            return log(`Solve linen RFID ${rfid} by id_user ${decodedToken.id} is on invalid type`)
        }
        removeNeedSolvingData(rfid)
    })

    socket.on("disconnect", (reason) => {
        log(`User ${socket.id} disconnected with reason: ${reason}`);
    });
}

/**
 * 
 * @param {Server} io 
 * @param {{
 * id_linen: number;
 * rfid: string;
 * type: string;
 * wash_status: string;
 * last_wash_room: string;
 * last_wash_start: string;
 * }[]} need_washings 
 * @returns 
 */
const broadcastNotificationWashed = (io, need_washings) => {
    if (io == null) { return }
    io.emit('need_washing', need_washings)
    log(`Broadcasted need washings ${need_washings.length} rfid`);
}

/**
 * 
 * @param {Server} io 
 * @param {{
 * id_linen: number;
 * rfid: string;
 * type: string;
 * room: string;
 * }[]} need_solving 
 * @returns 
 */
const broadcastNotificationNeedSolving = (io, need_solving) => {
    if (io == null) { return }
    io.emit('need_solving', need_solving)
    log(`Broadcasted need solvings ${need_solving.length} rfid`);
}

const checkHaventDoneWashing = async () => {
    try {
        need_washings = await NotifModel.HaventDoneWashingInCertainDays()
        broadcastNotificationWashed(ServerIO, need_washings)
    } catch (error) {
        log(`Failed to get notification washed data with reason: ${error}`);
    }
}

const notifRunner = async () => {
    await checkHaventDoneWashing()
    setTimeout(notifRunner, 60 * 60 * 1000) // every one hour
}

module.exports = { notifRunner, setNotifServerIO, notificationSocket, insertNeedSolvingData }