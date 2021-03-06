const express = require("express");
const router = express.Router();
const jwt = require("../util/jwt");
const model = require("../models/user");
const helpers = require("../util/helpers");
const { generalError, generalSuccess } = helpers;

router.post("/login", (req, res, next) => {
  model.login(req.body).then(user => {
    const token = jwt.sign({ authId: user._id });
    generalSuccess(res, "Auth successful", { token, user });
  }).catch(e => generalError(e, res));
});

router.use(jwt.verifyHelper);
router.get("/token", (req, res) => {
  model.getByToken(req.body).then(r => generalSuccess(res, "Get logged user", r)).catch(e => generalError(e, res));
});
router.get("/all", (req, res) => {
  model.getAll().then(r => generalSuccess(res, "Get users list", r)).catch(e => generalError(e, res));
});
router.post("/", (req, res) => {
  model.getById(req.body).then(r => generalSuccess(res, "Get user by id", r)).catch(e => generalError(e, res));
});
router.post("/validation", (req, res) => {
  model.existEmail(req.body).then(r => generalSuccess(res, "Email exists", r)).catch(e => generalError(e, res));
});
router.post("/create", (req, res) => {
  model.create(req.body).then(user => generalSuccess(res, "Create User Ok", { user })).catch(e => generalError(e, res));
});
router.put("/update", (req, res) => {
  model.update(req.body).then(user => generalSuccess(res, "Update User Ok", { user })).catch(e => generalError(e, res));
});
router.delete("/delete", (req, res) => {
  model.delete(req.body).then(r => generalSuccess(res, "User deleted", r)).catch(e => generalError(e, res));
});
module.exports = router;
