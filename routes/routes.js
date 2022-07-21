const express = required("express");
const router = express.Router();
const authCtrl = require("../controllers/authCtrl");

router.post("/signin", authCtrl.postSignin);
router.post("/login", authCtrl.postLogin);
router.get("/user", authCtrl.getUser);

module.exports = router;
