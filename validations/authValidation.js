import { body } from "express-validator";

export const registrationValidation = [
  body("username", "Имя пользователя не может быть пустым").notEmpty(),
  body("password", "Длина пароля должна быть от 4 до 10 символов").isLength({
    min: 4,
    max: 10,
  }),
];
