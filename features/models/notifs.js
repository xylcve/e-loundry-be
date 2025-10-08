const { dbPool } = require("../../config/initmysql")
const { NOTIF_DAYS_LIMIT, MAX_WASH_COUNT } = require("../constants")

class NotifModel {
    /**
     * 
     * @returns {Promise<{id_linen: number, rfid: string, type: string, wash_status: string, last_wash_room: string, last_wash_start: string}[]>}
     */
    static async HaventDoneWashingInCertainDays() {
        const [result] = await dbPool.query(
            `SELECT 
                l.id id_linen, lr.rfid, l.type, w.status wash_status, w.room last_wash_room, 
                w.created_at last_wash_start
            FROM linens l
            LEFT JOIN linen_rfids lr ON lr.id = l.id_rfid
            LEFT JOIN (
                SELECT a.id_linen, a.status, a.created_at, a.finished_at, b.room
                FROM washings a
                LEFT JOIN rooms b ON b.id = a.from_room 
            ) w ON l.id = w.id_linen 
            WHERE 
                l.is_active = 1 AND 
                w.finished_at IS NULL 
                AND (w.created_at IS NOT NULL AND w.created_at < DATE_SUB(NOW(), INTERVAL ${NOTIF_DAYS_LIMIT} DAY))`
        )

        for (let i = 0; i < result.length; i++) {
            const [check_washing] = await dbPool.query(
                `SELECT count(id) wash_count FROM washings WHERE finished_at IS NOT NULL AND id_linen = :id_linen`,
                { id_linen: result[i].id_linen }
            )
            if (check_washing.length == 0) {
                throw new Error('Washing status not found!')
            }

            result[i].wash_count = check_washing[0].wash_count
        }

        return result
    }

    /**
     * 
     * @returns {Promise<{id_linen: number, rfid: string, type: string, room: string, wash_count: number}[]>}
     */
    static async WashedMoreThanMaximum() {
        const [result] = await dbPool.query(
            `SELECT 
                l.id id_linen, lr.rfid, l.type, r.room, COALESCE(w.wash_count, 0) wash_count
            FROM linens l
            LEFT JOIN linen_rfids lr ON lr.id = l.id_rfid
            LEFT JOIN rooms r ON r.id = l.id_room 
            LEFT JOIN (
                SELECT id_linen, count(id) wash_count FROM washings WHERE finished_at IS NOT NULL GROUP BY id_linen
            ) w ON l.id = w.id_linen
            WHERE w.wash_count > ${MAX_WASH_COUNT} AND l.is_active = 1`
        )

        return result
    }

    /**
     * 
     * @param {string[]} rfids 
     * @return {Promise<{id_linen: number, rfid: string, type: string, room: string}[]>}
     */
    static async NeedSolvingData(rfids) {
        const args = {}
        const query = []
        for (let i = 0; i < rfids.length; i++) {
            query.push(`lr.rfid = :rfid${i}`)
            args[`rfid${i}`] = rfids[i]
        }

        const [result] = await dbPool.query(
            `SELECT 
                l.id id_linen, lr.rfid, l.type, r.room
            FROM linens l
            LEFT JOIN linen_rfids lr ON lr.id = l.id_rfid
            LEFT JOIN rooms r ON r.id = l.id_room 
            WHERE ${query.join(" OR ")}`,
            args,
        )

        return result
    }
}

module.exports = { NotifModel }