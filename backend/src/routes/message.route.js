import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"; //This checks if the user is logged in before letting them use any routes (security).
import { getUsersForSidebar,getMessages,sendMessage } from "../controllers/message.controller.js";


const router = express.Router(); // Creates a mini version of Express just for messages.

router.get("/users",protectRoute,getUsersForSidebar);
router.get("/:id",protectRoute,getMessages);

router.post("/send/:id",protectRoute,sendMessage);

export default router;