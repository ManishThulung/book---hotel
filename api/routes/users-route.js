import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user-controllers.js ";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// router.get("/check", verifyToken, (req, res, next) => {
//   res.send("You are authenticated");
// });

// router.get("/check/:id", verifyToken, verifyUser, (req, res, next) => {
//   res.send("You can delete it");
// });

router.get("/checkAdmin", verifyAdmin, (req, res, next) => {
  res.send("You can delete it, u r an admin");
});

router.put("/:id", verifyUser, updateUser);

router.delete("/:id", verifyUser, deleteUser);

router.get("/:id", verifyUser, getUser);

router.get("/", verifyAdmin, getUsers);

export default router;
