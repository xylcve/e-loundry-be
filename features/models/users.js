const { dbPool } = require("../../config/initmysql");

class UsersModel {
    /**
     * 
     * @param {string} username 
     * @returns {Promise<{id: number, username: string, password: string | null, role: string}>}
     */
    static getUserFromUsername = async (username) => {
        const [user] = await dbPool.query(
            `SELECT u.id, u.username, u.password, r.role 
            FROM users u 
            LEFT JOIN roles r ON u.id_role = r.id 
            WHERE u.username = :username`, { username }
        )
        if (user.length == 0) {
            throw new Error('User not found!')
        }
        return user[0];
    }

    /**
     * 
     * @param {number} id 
     * @returns {Promise<{id: number, username: string, password: string | null, role: string}>}
     */
    static getUserFromID = async (id) => {
        const [user] = await dbPool.query(
            `SELECT u.id, u.username, u.password, r.role 
            FROM users u 
            LEFT JOIN roles r ON u.id_role = r.id 
            WHERE u.id = :id`, { id }
        )
        if (user.length == 0) {
            throw new Error('User not found!')
        }
        return user[0];
    }

    /**
     * 
     * @returns {Promise<{id: number, username: string, role: string}[]>}
     */
    static getAllUsers = async () => {
        const [users] = await dbPool.query(
            `SELECT u.id, u.username, r.role 
            FROM users u 
            LEFT JOIN roles r ON u.id_role = r.id`
        );

        return users;
    }

    /**
     * 
     * @returns {Promise<{id: number, username: string, password: string | null, role: string}[]>}
     */
    static getAllUsersWithPassword = async () => {
        const [users] = await dbPool.query(
            `SELECT u.id, u.username, u.password, r.role 
            FROM users u 
            LEFT JOIN roles r ON u.id_role = r.id`
        );

        return users;
    }


    /**
     * 
     * @returns {Promise<{id: number, role: string}[]>}
     */
    static getAllRoles = async () => {
        const [result] = await dbPool.query(`SELECT id, role FROM roles`);
        return result;
    }

    /**
     * 
     * @param {number} id_role 
     * @param {string} username 
     * @returns {Promise<import("mysql2").OkPacketParams>}
     */
    static insertUser = async (id_role, username) => {
        const [resp] = await dbPool.query(
            `INSERT INTO users (id_role, username) VALUES (:id_role, :username)`,
            { id_role, username }
        )
        return resp;
    }

    /**
     * 
     * @param {number} id 
     * @param {number | null} id_role 
     * @param {string | null} username 
     * @returns {Promise<import("mysql2").OkPacketParams>}
     */
    static updateUser = async (id, id_role, username) => {
        let fields_val = ``
        if (id_role != null) fields_val += `id_role = :id_role, `
        if (username != null) fields_val += `username = :username, `

        if (fields_val == ``) { throw new Error(`Fields is empty!`) }

        fields_val = fields_val.trimEnd();
        fields_val = fields_val.slice(0, fields_val.length - 1);

        const [resp] = await dbPool.query(
            `UPDATE users SET ${fields_val} WHERE id=:id `,
            { id, id_role, username }
        );
        return resp;
    }

    /**
     * 
     * @param {number} id 
     * @returns {Promise<import("mysql2").OkPacketParams>}
     */
    static deleteUser = async (id) => {
        const [resp] = await dbPool.query(
            `DELETE FROM users WHERE id=:id`,
            { id }
        )
        return resp;
    }

}

module.exports = { UsersModel }