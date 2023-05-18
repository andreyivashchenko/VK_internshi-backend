import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { key } from "../config.js";
const generateAccessToken = (id, username) => {
  const payload = {
    id,
    username,
  };
  return jwt.sign(payload, key.secret, { expiresIn: "24h" });
};
export default class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации", errors });
      }
      const { email, firstname, lastname, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким email уже существует!" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });

      const user = new User({
        email,
        firstname,
        lastname,
        password: hashPassword,
        roles: [userRole.value],
      });
      await user.save();
      const { _id } = await User.findOne({ email });
      user._id = _id;
      const token = generateAccessToken(user._id, user.email);
      return res.json({ token, message: "Пользователь создан!" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error!" });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ message: `Пользователь с email ${email} не найден` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Введен неверный пароль" });
      }
      const token = generateAccessToken(user._id, user.email);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error!" });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json({ users });
    } catch (e) {
      console.log(e);
      res
        .status(400)
        .json({ message: "Ошибка получения списка пользователей" });
    }
  }
  async getUserInfo(req, res) {
    try {
      const id = req.user.id;
      const user = await User.findById({ _id: id });
      const {
        firstname,
        lastname,
        email,
        birthday,
        avatarImg,
        city,
        university,
      } = user;
      res.json({
        firstname,
        lastname,
        email,
        birthday,
        avatarImg,
        city,
        university,
      });
    } catch (e) {
      console.log(e);
      res
        .status(400)
        .json({ message: "Ошибка получения информации о пользователе" });
    }
  }
}
