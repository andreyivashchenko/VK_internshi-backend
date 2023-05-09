import mongoose from "mongoose";
import express from "express";
import authRouter from "./routers/authRouter.js";
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use("/auth", authRouter);
app.get("/", (req, res) => {
  res.status(200).json("что то там работает дада");
});
const start = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://Andrey:scx1bDwkn93hcTb5@cluster0.ycbndi4.mongodb.net/?retryWrites=true&w=majority"
      )
      .then(() => {
        console.log("db ok");
      });
    app.listen(PORT, () => {
      console.log(`Server started in port = ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
