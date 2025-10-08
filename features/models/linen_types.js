const { dbPool } = require("../../config/initmysql");

class LinenTypesModel {
    /**
     * 
     * @returns {Promise<{id: number, type: string}[]}
     */
    static getAllLinenTypes = async () => {
        const [resp, fields] = await dbPool.query(`SELECT id, type FROM linen_types`);
        return resp
    }

    /**
     * 
     * @param {string} type 
     * @returns {Promise<import("mysql2").OkPacketParams>}
     */
    static createLinenType = async (type) => {
        const query = `INSERT INTO linen_types (type) VALUES (:type)`;
        const [resp] = await dbPool.query(query, { type });
        return resp
    }

    /**
     * 
     * @param {number} id 
     * @param {string} type 
     * @returns {Promise<import("mysql2").OkPacketParams>}
     */
    static updateLinenType = async (id, type) => {
        const query = `UPDATE linen_types SET type=:type WHERE id=:id `;
        const [resp] = await dbPool.query(query, { id, type });
        return resp
    }

    /**
     * 
     * @param {number} id 
     * @returns {Promise<import("mysql2").OkPacketParams>}
     */
    static deleteLinenType = async (id) => {
        const query = `DELETE FROM linen_types WHERE id=:id `;
        const [resp] = await dbPool.query(query, { id });
        return resp
    }
}

module.exports = { LinenTypesModel }