const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const Sequelize = require("sequelize");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "email", "role", "createdBy"],
        });
        res.status(200).json({
            success: true,
            message: "List All Users",
            data: users,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.addUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const isExisting = await User.findOne({
            where: { email }
        })
        if (isExisting) {
            return res.status(409).json({
                status: false,
                msg: 'User already exists'
            })
        }

        const salt = 10;
        const hashPassword = await bcrypt.hash(password, salt);
        const created_by = req.user.email
        const user = await User.create({
            email: email,
            password: hashPassword,
            role: role,
            createdBy: created_by
        })
        res.status(201).json({
            status: true,
            message: 'Data added successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        })
        console.log(error);
    }
}

exports.Register = async (req, res) => {
    // console.log(req.body)
    const { email, password, role } = req.body;

    const emailExisted = await User.findOne({
        where: {
            email: email,
        },
    });

    if (emailExisted) {
        return res.status(409).json({
            status: false,
            msg: 'Email already exists'
        })
    }
    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        let user = await User.create({
            email: email,
            password: hashPassword,
            role: role,
        });

        user = JSON.parse(JSON.stringify(user));

        return res.status(200).json({
            success: true,
            message: "Register Successfully",
        });
    } catch (error) {
        console.log(error);
    }
};

exports.Login = async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        user = JSON.parse(JSON.stringify(user));

        if (!user)
            return res
                .status(400)
                .json({ success: false, message: "Email or Password didn't match" });
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match)
            return res
                .status(400)
                .json({ success: false, message: "Wrong Password" });

        //token generation
        let refreshTokens = [];

        const userId = user.id;
        const email = user.email;
        const role = user.role;

        const tokenParams = { userId, email, role };

        const accessToken = jwt.sign(tokenParams, "access", {
            expiresIn: "1d",
        });
        const refreshToken = jwt.sign(tokenParams, "refresh", {
            expiresIn: "183d",
        });
        refreshTokens.push(refreshToken);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        const data = {
            userId,
            email,
            role,
            accessToken,
            refreshToken,
        };

        return res.status(201).json({
            success: true,
            message: "Login Successfully",
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false, message: "Login Failed" });
    }
};

exports.Logout = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) return res.sendStatus(204);

    res.clearCookie("refreshToken");
    return res
        .status(200)
        .json({ success: true, message: "Logout Successfully" });
};
