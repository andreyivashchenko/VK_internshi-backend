import { body } from "express-validator";

export const registrationValidation = [
  body("firstname", "Поле Имя пользователя не может быть пустым").notEmpty(),
  body("lastname", "Поле фамилия не может быть пустым").notEmpty(),
  body("email", "email введен неверно").isEmail(),
  body("password", "Длина пароля должна быть от 4 до 10 символов").isLength({
    min: 4,
    max: 10,
  }),
];
