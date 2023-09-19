const Router = require("express");
const authController = require("../controllers/authController");

const router = Router();

router.get("/", () => console.log("hello world!"));

/**
 * Auth Routers
 */
router.post("/register", authController.register);

router.post("/login", authController.login);

module.exports = router;
