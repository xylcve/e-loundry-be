const { dbPool } = require("../../config/initmysql");
const { WASHING_STATUS } = require("../constants");

class DashboardModel {
    /**
     * 
     * @returns {Promise<{id_linen: number, wash_count: number}[]>}
     */
    static async ActiveLinenMaxWashed() {
        const [result] = await dbPool.query(
            `SELECT w.id_linen, count(w.id) wash_count
             FROM linens l
             LEFT JOIN washings w ON l.id = w.id_linen 
             WHERE w.finished_at IS NOT NULL
             GROUP BY w.id_linen`,
        )

        return result
    }

    /**
     * 
     * @param {Date} start_date 
     * @param {Date} end_date
     * @returns {Promise<{count: number, status: string}[]>} 
     */
    static async LinenByStatus(start_date, end_date) {
        const [result] = await dbPool.query(
            `SELECT COUNT(l.id) count, COALESCE(w2.status, "not_yet_washed") status  
            FROM linens l
            LEFT JOIN (
                SELECT MAX(id) id, id_linen FROM washings 
                WHERE created_at > :start_date AND created_at <= :end_date 
                GROUP BY id_linen
            ) w ON l.id = w.id_linen
            LEFT JOIN washings w2 ON w.id = w2.id
            WHERE l.is_active = 1
            GROUP BY w2.status`,
            { start_date, end_date }
        )

        return result
    }

    /**
     * 
     * @param {string?} tipe
     * @returns {Promise<{count: number, room: string}[]>}
     */
    static async LinenByRoomDesc(tipe) {
        const [result] = await dbPool.query(
            `SELECT COUNT(l.id) count, r.room 
            FROM linens l
            LEFT JOIN rooms r ON r.id = l.id_room 
            WHERE l.id_room IS NOT NULL AND l.is_active = 1 ${tipe != null ? ' AND tipe = :tipe' : ''}
            GROUP BY l.id_room
            ORDER BY COUNT(l.id) DESC
            LIMIT 0, 10`,
            { tipe }
        )

        return result
    }

    /**
     * 
     * @param {string?} tipe
     * @returns {Promise<{count: number, room: string}[]>}
     */
    static async LinenByRoomAsc(tipe) {
        const [result] = await dbPool.query(
            `SELECT COUNT(l.id) count, r.room 
            FROM linens l
            LEFT JOIN rooms r ON r.id = l.id_room 
            WHERE l.id_room IS NOT NULL AND l.is_active = 1 ${tipe != null ? ' AND tipe = :tipe' : ''}
            GROUP BY l.id_room
            ORDER BY COUNT(l.id) ASC
            LIMIT 0, 10`,
            { tipe }
        )

        return result
    }
}

module.exports = { DashboardModel }