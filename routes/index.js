const Router = require("express");
const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/", () => console.log("hello world!"));

/**
 * Auth Routers
 */
router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", requireAuth, authController.logout);

module.exports = router;
