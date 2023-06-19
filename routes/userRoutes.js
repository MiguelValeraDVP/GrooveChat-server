const {
  register,
  login,
  setAvatar,
  getAllUsers,
} = require("../controllers/userController");

const router = require("express").Router();

router.get("/all-users/:id", getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.post("/set-avatar/:id", setAvatar);

module.exports = router;
