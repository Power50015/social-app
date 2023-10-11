const Router = require("express");
const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

const postController = require("../controllers/postController");
const friendRequestController = require("../controllers/friendRequestController");

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json("");
});

/**
 * Auth Routers
 */
router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", requireAuth, authController.logout);

/**
 * Post Routers
 */
router.get("/post", requireAuth, postController.index);
router.post("/post", requireAuth, postController.create);

/**
 * Friend request
*/
router.get("/friend-request", requireAuth, friendRequestController.index);
router.post("/friend-request", requireAuth, friendRequestController.create);

/**
 * Friend CRUD
*/

// router.post("/friend-accept", requireAuth, friendController.create); // Create



module.exports = router;
