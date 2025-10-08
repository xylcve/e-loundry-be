const { dbPool } = require("../../config/initmysql");

class RoomsModel {
    /**
     * 
     * @returns {Promise<{id: number, room: string, tipe: string}[]>}
     */
    static getAllRooms = async () => {
        const [resp, fields] = await dbPool.query(`SELECT id, room, tipe FROM rooms`)
        return resp
    }


    /**
     * 
     * @returns {Promise<{tipe: string}[]>}
     */
    static getAllRoomTypes = async () => {
        const [resp, fields] = await dbPool.query(`SELECT DISTINCT tipe FROM rooms`)
        return resp
    }

    /**
     * 
     * @param {string} room 
     * @param {string} tipe 
     * @returns {Promise<import("mysql2").OkPacketParams>}
     */
    static createRoom = async (room, tipe) => {
        if (room == '') { throw new Error('room is invalid') }
        if (tipe == '') { throw new Error('tipe is invalid') }

        const query = `INSERT INTO rooms (room, tipe) VALUES (:room, :tipe)`;
        const [resp] = await dbPool.query(query, { room, tipe });
        return resp
    }

    /**
     * 
     * @param {number} id 
     * @param {string?} room 
     * @param {string?} tipe 
     * @returns {Promise<import("mysql2").OkPacketParams>}
     */
    static updateRoom = async (id, room, tipe) => {
        let fields_val = ``
        if (room != null) { fields_val += `room = :room, ` }
        if (tipe != null) { fields_val += `tipe = :tipe, ` }

        if (room == '') { throw new Error('room is invalid') }
        if (tipe == '') { throw new Error('tipe is invalid') }

        if (fields_val == ``) { throw new Error("fields is empty!") }

        fields_val = fields_val.trimEnd();
        fields_val = fields_val.slice(0, fields_val.length - 1);

        const query = `UPDATE rooms SET ${fields_val} WHERE id=:id `;
        const [resp] = await dbPool.query(query, { id, room, tipe });
        return resp
    }

    /**
     * 
     * @param {number} id 
     * @returns {Promise<import("mysql2").OkPacketParams>}
     */
    static deleteRoom = async (id) => {
        const query = `DELETE FROM rooms WHERE id=:id `;
        const [resp] = await dbPool.query(query, { id });
        return resp
    }
}

module.exports = { RoomsModel }