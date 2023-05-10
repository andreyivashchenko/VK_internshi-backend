import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { key } from "../config.js";
const generateAccessToken = (id, username, roles) => {
  const payload = {
    id,
    username,
    roles,
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
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким именем уже существует!" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });

      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
      });
      await user.save();
      const { _id } = await User.findOne({ username });
      user._id = _id;
      const token = generateAccessToken(user._id, user.username, user.roles);
      return res.json({ token, message: "Пользователь создан!" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error!" });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: `Пользователь с именем ${username} не найден` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Введен неверный пароль" });
      }
      const token = generateAccessToken(user._id, user.username, user.roles);
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
      const { username, roles } = await User.findById({ _id: id });
      res.json({ username, roles: roles[0] });
    } catch (e) {
      console.log(e);
      res
        .status(400)
        .json({ message: "Ошибка получения информации о пользователе" });
    }
  }
}
