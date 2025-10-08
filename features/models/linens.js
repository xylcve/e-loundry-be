const { format } = require("date-fns")
const { dbPool } = require("../../config/initmysql")

class LinensModel {
    /**
     * 
     * @param {number} from_row 
     * @param {number} limit 
     * @param {Date | null} start_date 
     * @param {Date | null} end_date 
     * @returns {Promise<{count: number, linens: {id: number, rfid: string, room: string, wash_count: number}[]}>}
     */
    static getAllActiveLinens = async (from_row, limit, start_date, end_date) => {
        if (typeof from_row != "number" || typeof limit != "number") {
            throw Error("invalid from and limit")
        }

        const [count_active_linens] = await dbPool.query(
            `SELECT COUNT(id) cnt FROM linens 
            WHERE is_active = 1 
            ${start_date == null && end_date == null ? '' : ' AND created_at > :start_date AND created_at <= :end_date '}`,
            {
                start_date: start_date == null ? null : format(start_date, 'yyyy-MM-dd 00:00:00'),
                end_date: end_date == null ? null : format(end_date, 'yyyy-MM-dd 23:59:59')
            }
        )

        const [resp] = await dbPool.query(
            `SELECT l.id, lr.rfid, r.room, l.type, w.wash_count
            FROM linens l
            LEFT JOIN linen_rfids lr ON l.id_rfid = lr.id  
            LEFT JOIN rooms r ON l.id_room = r.id
            LEFT JOIN (
                SELECT count(id) wash_count, id_linen 
                FROM washings 
                WHERE finished_at IS NOT NULL
                GROUP BY id_linen
            ) w ON l.id = w.id_linen
            WHERE l.is_active = 1 
            ${start_date == null && end_date == null ? '' : ' AND created_at > :start_date AND created_at <= :end_date '}
            LIMIT :from_row, :limit`,
            {
                from_row,
                limit,
                start_date: start_date == null ? null : format(start_date, 'yyyy-MM-dd 00:00:00'),
                end_date: end_date == null ? null : format(end_date, 'yyyy-MM-dd 23:59:59')
            }
        )

        return { count: count_active_linens[0].cnt, linens: resp }
    }

    /**
     * 
     * @param {number} from_row 
     * @param {number} limit 
     * @param {number} id_room 
     * @returns {Promise<{count: number, linens: {id: number, rfid: string, room: string}[]}>}
     */
    static getAllActiveLinenInRooms = async (from_row, limit, id_room) => {
        if (typeof from_row != "number" || typeof limit != "number" || typeof id_room != "number") {
            throw Error("invalid from and limit")
        }

        const [count_active_linens] = await dbPool.query(
            `SELECT COUNT(id) cnt FROM linens 
            WHERE is_active = 1 AND id_room = :id_room `,
            { id_room: id_room }
        )

        const [resp] = await dbPool.query(
            `SELECT l.id, lr.rfid, r.room, l.type, w.wash_count
            FROM linens l
            LEFT JOIN linen_rfids lr ON l.id_rfid = lr.id  
            LEFT JOIN rooms r ON l.id_room = r.id
            LEFT JOIN (
                SELECT count(id) wash_count, id_linen 
                FROM washings 
                WHERE finished_at IS NOT NULL
                GROUP BY id_linen
            ) w ON l.id = w.id_linen
            WHERE is_active = 1 AND id_room = :id_room 
            LIMIT :from_row, :limit`,
            { from_row, limit, id_room }
        )

        return { count: count_active_linens[0].cnt, linens: resp }
    }

    /**
     * 
     * @param {string} rfid 
     * @returns 
     */
    static getLinenByRFID = async (rfid) => {
        const [check_rfid] = await dbPool.query(`SELECT id, rfid FROM linen_rfids WHERE rfid = :rfid`, { rfid })
        if (check_rfid.length == 0) {
            throw new Error('RFID not found!')
        }

        const [resp] = await dbPool.query(
            `SELECT l.id, lr.rfid, r.room, l.type, l.is_active  
            FROM linens l
            LEFT JOIN linen_rfids lr ON l.id_rfid = lr.id  
            LEFT JOIN rooms r ON l.id_room = r.id
            WHERE l.id_rfid = :id_rfid`,
            { id_rfid: check_rfid[0].id }
        )
        return resp
    }

    /**
     * 
     * @param {string} rfid 
     * @param {string} type 
     * @param {number} id_room 
     * @returns {Promise<import("mysql2").OkPacketParams>}
     */
    static insertLinen = async (rfid, type, id_room) => {
        const conn = await dbPool.getConnection()
        await conn.beginTransaction()
        try {
            let id_rfid = null;
            const [check_rfid] = await conn.query(`SELECT id, rfid FROM linen_rfids WHERE rfid = :rfid`, { rfid })
            if (check_rfid.length == 0) {
                /**
                 * @type {[import("mysql2").OkPacketParams]}
                 */
                const [insert] = await conn.query(`INSERT INTO linen_rfids (rfid) VALUES (:rfid)`, { rfid })
                if (insert.insertId == null) {
                    throw new Error('Failed to insert new RFID')
                }
                id_rfid = insert.insertId
            } else {
                id_rfid = check_rfid[0].id
            }

            const query = `INSERT INTO linens (id_room,id_rfid,type,is_active) VALUES (:id_room,:id_rfid,:type,1)`;
            const [resp] = await conn.query(query, { id_room, id_rfid, type });

            await conn.commit()
            return resp
        } catch (error) {
            await conn.rollback()
            throw error
        }
    }

    /**
     * 
     * @param {number} id 
     * @param {{
     *  id_room: number | null,
     *  type: string | null,
     * }} fields
     * @returns {Promise<import("mysql2").OkPacketParams>}
     */
    static updateLinen = async (id, fields) => {
        const { id_room, type } = fields

        let fields_val = ``
        if (id_room != null) { fields_val += `id_room = :id_room, ` }
        if (type != null) { fields_val += `type = :type, ` }

        if (fields_val == ``) { throw new Error('Fields is empty!') }

        fields_val = fields_val.trimEnd();
        fields_val = fields_val.slice(0, fields_val.length - 1);

        const query = `UPDATE linens SET ${fields_val} WHERE id = :id `;
        const [resp] = await dbPool.query(query, { id, id_room, type });
        return resp;
    }

    /**
     * 
     * @param {string[]} batch_rfid 
     * @returns {Promise<{disabled: number}>}
     */
    static disableLinens = async (batch_rfid) => {
        const conn = await dbPool.getConnection()
        await conn.beginTransaction()
        try {
            let disabled = 0;
            for (const rfid of batch_rfid) {
                const [id] = await conn.query(`SELECT id FROM linen_rfids WHERE rfid = :rfid`, { rfid })
                if (id.length == 0) {
                    throw new Error(`${rfid} invalid rfid!`)
                }

                /**
                 * @type {[import("mysql2").OkPacketParams]}
                 */
                const [result] = await conn.query(`UPDATE linens SET id_rfid = NULL, is_active = 0 WHERE id_rfid = :id_rfid`, { id_rfid: id[0].id })
                disabled += result.affectedRows ?? 0
            }
            await conn.commit()
            return { disabled }
        } catch (error) {
            await conn.rollback()
            throw error
        }
    }

    /**
     * 
     * @param {string} old_rfid 
     * @param {string} new_rfid 
     * @returns 
     */
    static changeRfidLinen = async (old_rfid, new_rfid) => {
        const conn = await dbPool.getConnection()
        await conn.beginTransaction()
        try {
            const [check_old_id] = await conn.query(`SELECT id FROM linen_rfids WHERE rfid = :old_rfid`, { old_rfid })
            if (check_old_id.length == 0) {
                throw new Error(`${old_rfid} invalid old rfid!`)
            }
            const old_id = check_old_id[0].id

            const [check_linen] = await conn.query(`SELECT id FROM linens WHERE id_rfid = :id_rfid`, { id_rfid: old_id })
            if (check_linen.length == 0) {
                throw new Error(`${old_rfid} rfid is not on any linen!`)
            }

            let new_id = null
            const [check_new_id] = await conn.query(`SELECT id FROM linen_rfids WHERE rfid = :new_rfid`, { new_rfid })
            if (check_new_id.length == 0) {
                /**
                 * @type {[import("mysql2").OkPacketParams]}
                 */
                const [insert] = await conn.query(`INSERT INTO linen_rfids (rfid) VALUES (:new_rfid)`, { new_rfid })
                if (insert.insertId == null) {
                    throw new Error('Failed to insert new RFID')
                }
                new_id = insert.insertId
            } else {
                new_id = check_new_id[0].id
            }

            /**
             * @type {[import("mysql2").OkPacketParams]}
             */
            const [result] = await conn.query(`UPDATE linens SET id_rfid = :new_id WHERE id_rfid = :old_id`, { new_id, old_id })

            await conn.commit()
            return result
        } catch (error) {
            await conn.rollback()
            throw error
        }
    }
}

module.exports = { LinensModel }