require("dotenv").config();
const { response } = require("../../utility/response");
const joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config/config");
const { UsersModel } = require("../models/users");

const auth = async (req, res) => {
  try {
    const schema = joi.object({
      username: joi.string().required(),
      password: joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return response(res, 400, `[Bad Request] ${error.message}`);
    }

    const { username, password } = req.body;

    const user = await UsersModel.getUserFromUsername(username);

    let valid = false;
    if (user.password == null) {
      if (password == process.env.DEFAULT_PASSWORD) {
        valid = true;
      }
    } else {
      valid = await bcrypt.compare(password, user.password);
    }

    if (valid == true) {
      // process auth
      const userdata = {
        id: user.id,
        role: user.role,
      };
      const access_token = jwt.sign(userdata, SECRET_KEY, { expiresIn: "18h" });
      return response(res, 200, "[Success]", {
        access_token,
        username: user.username,
        role: user.role,
      });
    }
    return response(res, 500, "[Internal Server Error] User not found!");
  } catch (error) {
    return response(res, 500, `[Internal Server Error] ${error.message}`);
  }
};

const refreshToken = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await UsersModel.getUserFromID(id);

    const userdata = {
      id: user.id,
      role: user.role,
    };
    const access_token = jwt.sign(userdata, SECRET_KEY, { expiresIn: "18h" });

    return response(res, 200, "[Success]", {
      access_token,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    return response(res, 500, `[Internal Server Error] ${error.message}`);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await UsersModel.getAllUsers();
    return response(res, 200, "[Success]", users);
  } catch (error) {
    return response(res, 500, `[Internal Server Error] ${error.message}`);
  }
};

const getRoles = async (req, res) => {
  try {
    const resp = await UsersModel.getAllRoles();
    return response(res, 200, "[Success]", resp);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

const createUsers = async (req, res) => {
  try {
    const schema = joi.object({
      id_role: joi.number().required(),
      username: joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return response(res, 400, `[Bad Request] ${error.message}`);
    }

    const { id_role, username } = req.body;

    const resp = await UsersModel.insertUser(id_role, username);
    return response(res, 200, "[Success]", resp);
  } catch (error) {
    return response(res, 500, `[Internal Server Error] ${error.message}`);
  }
};

const updateUsers = async (req, res) => {
  try {
    const schema = joi.object({
      id: joi.number().required(),
      fields: joi
        .object({
          id_role: joi.number().optional(),
          username: joi.string().optional(),
        })
        .required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return response(res, 400, `[Bad Request] ${error.message}`);
    }

    const { id, fields } = req.body;
    const { id_role, username } = fields;

    const resp = await UsersModel.updateUser(id, id_role, username);
    if (resp.affectedRows == 0) {
      return response(res, 500, `[Internal Server Error] User not found!`);
    }

    return response(res, 200, "[Success]", resp);
  } catch (error) {
    return response(res, 500, `[Internal Server Error] ${error.message}`);
  }
};

const deleteUsers = async (req, res) => {
  try {
    const schema = joi.object({
      id: joi.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return response(res, 400, `[Bad Request] ${error.message}`);
    }

    const { id } = req.body;

    const resp = await UsersModel.deleteUser(id);
    if (resp.affectedRows == 0) {
      return response(res, 500, `[Internal Server Error] User not found!`);
    }

    return response(res, 200, "[Success]", resp);
  } catch (error) {
    return response(res, 500, `[Internal Server Error] ${error.message}`);
  }
};

module.exports = {
  auth,
  refreshToken,
  getUsers,
  getRoles,
  createUsers,
  updateUsers,
  deleteUsers,
};
