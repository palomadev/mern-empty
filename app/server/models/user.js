const user = require('../database/user');
const bcrypt = require('bcryptjs');

const model = {
    existEmail: async data => {
        const existUser = await user.getByEmail(data.email);
        if (existUser) throw { code: 400, msg: "The email already exists" };
    },
    login: async data => {
        if (!data) throw { code: 400, msg: "User data is required" };
        if (!data.email) throw { code: 400, msg: "Email is required" };
        if (!data.password) throw { code: 400, msg: "Password is required" };

        let exist = await user.getByEmail(data.email);
        if (exist && exist.password && await bcrypt.compare(data.password, exist.password)) return exist;
        throw { code: 401, msg: "Authentication failed" }
    },
    create: async data => {
        if (!data) throw { code: 400, msg: "Data is required" };
        if (!data.name) throw { code: 400, msg: "Name is required" };
        if (!data.email) throw { code: 400, msg: "Email is required" };
        if (!data.role) throw { code: 400, msg: "Role is required" };
        if (!data.password) throw { code: 400, msg: "Password is required" };

        const existUser = await user.getByEmail(data.email);
        if (existUser) throw { code: 400, msg: "The email already exists" };

        data.password = await bcrypt.hash(data.password, 10);

        return await user.create(data);
    },
    update: async data => {
        if (!data) throw { code: 400, msg: "Data is required" };
        if (!data.id) throw { code: 400, msg: "Id is required" };
        if (!data.name) throw { code: 400, msg: "Name is required" };
        if (!data.role) throw { code: 400, msg: "Role is required" };

        const existUser = await user.getById(data.id);
        if (!existUser) throw { code: 400, msg: "The user doesn't exists" };

        if (data.password) data.password = await bcrypt.hash(data.password, 10);
        else data.password = existUser.password

        return await user.update(data.id, data);
    },
    delete: async data => {
        if (!data) throw { code: 400, msg: "Params is empty" };
        if (!data._id) throw { code: 400, msg: "ID is required" };
        return await user.delete(data._id);
    },
    getAll: async () => {
        return await user.getAll();
    },
    getById: async data => {
        if (!data) throw { code: 400, msg: "Data is empty" };
        if (!data._id) throw { code: 400, msg: "ID is required" };
        return await user.getById(data._id);
    },
    getByToken: async data => {
        if (!data) throw { code: 400, msg: "Data is empty" };
        if (!data.authId) throw { code: 400, msg: "Id is required" };
        const res = await user.getById(data.authId);
        if (!res) throw { code: 400, msg: "User not found" };
        return res;
    }
}

module.exports = model;