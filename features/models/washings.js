const { dbPool } = require("../../config/initmysql")
const { MAX_WASH_COUNT, WASHING_STATUS, WASHING_RESULT } = require("../constants")

class WashingModel {
    /**
     * 
     * @param {string} rfid 
     */
    static checkOutRoom = async (rfid) => {
        const transaction = await dbPool.getConnection()
        await transaction.beginTransaction()
        try {
            const [check_rfid] = await transaction.query(
                `SELECT l.id, lr.rfid, l.is_active, l.id_room   
                FROM linens l
                LEFT JOIN linen_rfids lr ON lr.id = l.id_rfid
                WHERE lr.rfid = :rfid`,
                { rfid }
            )
            if (check_rfid.length == 0) {
                throw new Error('RFID not found!')
            }

            if (check_rfid[0].is_active == false) {
                throw new Error('Linen is inactive')
            }

            const [check_washing] = await transaction.query(
                `SELECT count(id) wash_count FROM washings WHERE finished_at IS NOT NULL AND id_linen = :id_linen`,
                { id_linen: check_rfid[0].id }
            )
            if (check_washing.length == 0) {
                throw new Error('Error failure check washing!')
            }
            if (check_washing[0].wash_count >= MAX_WASH_COUNT) {
                throw new Error(`Linen has been washed ${check_washing[0].wash_count} times!`)
            }

            const [check_on_process] = await transaction.query(
                `SELECT status FROM washings WHERE finished_at IS NULL AND id_linen = :id_linen`,
                { id_linen: check_rfid[0].id }
            )
            if (check_on_process.length != 0) {
                throw new Error(`Linen is on washing process (${check_on_process[0].status})!`)
            }

            await transaction.query(
                `UPDATE linens SET id_room = null WHERE id = :id_linen`,
                { id_linen: check_rfid[0].id }
            )

            await transaction.query(
                `INSERT INTO washings (id_linen, status, from_room) VALUES (:id_linen, :status, :from_room)`,
                { id_linen: check_rfid[0].id, status: WASHING_STATUS.OUT_ROOM, from_room: check_rfid[0].id_room }
            )

            await transaction.commit()
        } catch (error) {
            await transaction.rollback()
            throw error
        } finally {
            transaction.release()
        }
    }

    /**
     * 
     * @param {string[]} rfids 
     */
    static checkInWashingGate = async (rfids) => {
        /**
         * @type {{[rfid: string]: {type: string, msg: string}}}
         */
        const result = {}
        for (let i = 0; i < rfids.length; i++) {
            const rfid = rfids[i]

            const transaction = await dbPool.getConnection()
            await transaction.beginTransaction()
            try {
                const [check_rfid] = await transaction.query(
                    `SELECT l.id, lr.rfid, l.is_active, l.id_room  
                    FROM linens l
                    LEFT JOIN linen_rfids lr ON lr.id = l.id_rfid
                    WHERE lr.rfid = :rfid`,
                    { rfid }
                )
                if (check_rfid.length == 0) {
                    result[rfid] = { type: WASHING_RESULT.RFID_NOT_FOUND, msg: "RFID not found!" }
                    continue
                }

                if (check_rfid[0].is_active == false) {
                    result[rfid] = { type: WASHING_RESULT.LINEN_INACTIVE, msg: "Linen is inactive" }
                    continue
                }

                const [check_on_process] = await transaction.query(
                    `SELECT id, status FROM washings WHERE finished_at IS NULL AND id_linen = :id_linen`,
                    { id_linen: check_rfid[0].id }
                )
                if (check_on_process.length == 0) {
                    await transaction.query(
                        `UPDATE linens SET id_room = null WHERE id = :id_linen`,
                        { id_linen: check_rfid[0].id }
                    )

                    await transaction.query(
                        `INSERT INTO washings (id_linen, status, from_room) VALUES (:id_linen, :status, :from_room)`,
                        { id_linen: check_rfid[0].id, status: WASHING_STATUS.IN_LAUNDRY, from_room: check_rfid[0].id_room }
                    )
                } else {
                    await transaction.query(
                        `UPDATE washings SET status = :status WHERE id = :id`,
                        { status: WASHING_STATUS.IN_LAUNDRY, id: check_on_process[0].id }
                    )
                }
                result[rfid] = { type: WASHING_RESULT.SUCCESS, msg: "RFID processed" }

                await transaction.commit()
            } catch (error) {
                await transaction.rollback()
                result[rfid] = { type: WASHING_RESULT.UNKNOWN_ERROR, msg: error.toString() }
            } finally {
                transaction.release()
            }
        }
        return result
    }

    /**
     * 
     * @param {string[]} rfids 
     */
    static checkOutWashingGate = async (rfids) => {
        /**
         * @type {{[rfid: string]: {type: string, msg: string}}}
         */
        const result = {}
        for (let i = 0; i < rfids.length; i++) {
            const rfid = rfids[i]

            const transaction = await dbPool.getConnection()
            await transaction.beginTransaction()
            try {
                const [check_rfid] = await transaction.query(
                    `SELECT l.id, lr.rfid, l.is_active, l.id_room  
                    FROM linens l
                    LEFT JOIN linen_rfids lr ON lr.id = l.id_rfid
                    WHERE lr.rfid = :rfid`,
                    { rfid }
                )
                if (check_rfid.length == 0) {
                    result[rfid] = { type: WASHING_RESULT.RFID_NOT_FOUND, msg: "RFID not found!" }
                    continue
                }

                if (check_rfid[0].is_active == false) {
                    result[rfid] = { type: WASHING_RESULT.LINEN_INACTIVE, msg: "Linen is inactive" }
                    continue
                }

                const [check_on_process] = await transaction.query(
                    `SELECT id, status FROM washings WHERE finished_at IS NULL AND id_linen = :id_linen`,
                    { id_linen: check_rfid[0].id }
                )
                if (check_on_process.length == 0) {
                    await transaction.query(
                        `INSERT INTO washings (id_linen, status, from_room) VALUES (:id_linen, :status, :from_room)`,
                        { id_linen: check_rfid[0].id, status: WASHING_STATUS.OUT_LAUNDRY, from_room: check_rfid[0].id_room }
                    )
                } else {
                    await transaction.query(
                        `UPDATE washings SET status = :status WHERE id = :id`,
                        { status: WASHING_STATUS.OUT_LAUNDRY, id: check_on_process[0].id }
                    )
                }
                result[rfid] = { type: WASHING_RESULT.SUCCESS, msg: "RFID processed" }

                await transaction.commit()
            } catch (error) {
                await transaction.rollback()
                result[rfid] = { type: WASHING_RESULT.UNKNOWN_ERROR, msg: error.toString() }
            } finally {
                transaction.release()
            }
        }
        return result
    }

    /**
     * 
     * @param {string} rfid 
     * @param {number} id_room 
     */
    static checkInRoom = async (rfid, id_room) => {
        const transaction = await dbPool.getConnection()
        await transaction.beginTransaction()
        try {
            const [check_rfid] = await transaction.query(
                `SELECT l.id, lr.rfid, l.is_active  
                FROM linens l
                LEFT JOIN linen_rfids lr ON lr.id = l.id_rfid
                WHERE lr.rfid = :rfid`,
                { rfid }
            )
            if (check_rfid.length == 0) {
                throw new Error('RFID not found!')
            }

            if (check_rfid[0].is_active == false) {
                throw new Error('Linen is inactive')
            }

            const [check_washing] = await transaction.query(
                `SELECT count(id) wash_count FROM washings WHERE finished_at IS NOT NULL AND id_linen = :id_linen`,
                { id_linen: check_rfid[0].id }
            )
            if (check_washing.length == 0) {
                throw new Error('Error failure check washing!')
            }
            if (check_washing[0].wash_count >= MAX_WASH_COUNT + 1) {
                throw new Error(`Linen total wash is more than maximum (${check_washing[0].wash_count})!`)
            }

            const [check_first_time_wash] = await transaction.query(
                `SELECT COUNT(id) count FROM washings WHERE id_linen = :id_linen`,
                { id_linen: check_rfid[0].id }
            )
            if (check_first_time_wash[0].count == 0) {
                await transaction.query(
                    `INSERT INTO washings (id_linen, status, from_room, finished_at) VALUES (:id_linen, :status, :from_room, NOW())`,
                    { id_linen: check_rfid[0].id, status: WASHING_STATUS.IN_ROOM, from_room: id_room }
                )
            } else {
                const [check_on_process] = await transaction.query(
                    `SELECT id, status FROM washings WHERE finished_at IS NULL AND id_linen = :id_linen`,
                    { id_linen: check_rfid[0].id }
                )
                if (check_on_process.length == 0) {
                    throw new Error('Washing status not found!')
                }
                if (check_on_process[0].status != WASHING_STATUS.OUT_LAUNDRY) {
                    throw new Error(`Washing status is not ${WASHING_STATUS.OUT_LAUNDRY}!`)
                }

                await transaction.query(
                    `UPDATE linens SET id_room = :id_room WHERE id = :id_linen`,
                    { id_room, id_linen: check_rfid[0].id }
                )

                await transaction.query(
                    `UPDATE washings SET status = :status, finished_at = NOW() WHERE id = :id`,
                    { status: WASHING_STATUS.IN_ROOM, id: check_on_process[0].id }
                )
            }

            await transaction.commit()
        } catch (error) {
            await transaction.rollback()
            throw error
        } finally {
            transaction.release()
        }
    }

    /**
     * 
     * @param {string} rfid 
     * @returns {Promise<{ 
     *  id_linen: number,
     *  type: string,
     *  created_at: string,
     *  wash_count: number,
     *  last_wash: {status: string, from_room: string, created_at: string, finished_at: string | null} | null}
     * >}
     */
    static getWashingDetail = async (rfid) => {
        const [check_rfid] = await dbPool.query(
            `SELECT l.id, lr.rfid, l.type, l.created_at, l.is_active  
            FROM linens l
            LEFT JOIN linen_rfids lr ON lr.id = l.id_rfid
            WHERE lr.rfid = :rfid`,
            { rfid }
        )
        if (check_rfid.length == 0) {
            throw new Error('RFID not found!')
        }

        const [check_washing] = await dbPool.query(
            `SELECT count(id) wash_count FROM washings WHERE finished_at IS NOT NULL AND id_linen = :id_linen`,
            { id_linen: check_rfid[0].id }
        )
        if (check_washing.length == 0) {
            throw new Error('Washing status not found!')
        }

        const [last_washing] = await dbPool.query(
            `SELECT w.status, r.room from_room, w.created_at, w.finished_at 
            FROM washings w 
            LEFT JOIN rooms r ON r.id = w.from_room
            WHERE w.id_linen = :id_linen 
            ORDER BY w.id DESC LIMIT 0, 1`,
            { id_linen: check_rfid[0].id }
        )

        let last_wash = null
        if (last_washing.length != 0) {
            last_wash = last_washing[0]
        }

        return {
            id_linen: check_rfid[0].id,
            type: check_rfid[0].type,
            created_at: check_rfid[0].created_at,
            wash_count: check_washing[0].wash_count,
            last_wash
        }
    }
}

module.exports = { WashingModel, WASHING_STATUS }