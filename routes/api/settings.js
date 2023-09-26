const express = require("express");
const router = express.Router();


const ctrl = require("../../controllers/auth");
const {validateBody, authenticate, uploadCloud} = require("../../middlewares");
const {schemas} = require("../../models/user");
const jsonParser = express.json();



router.patch("/", jsonParser, authenticate, validateBody(schemas.settingsSchema), ctrl.updateSettings);

router.patch("/weight", jsonParser, authenticate, validateBody(schemas.weigthSchema), ctrl.updateWeigth);

router.patch("/goal", jsonParser, authenticate, validateBody(schemas.goalSchema), ctrl.updateGoal);

router.patch("/avatars", authenticate,  uploadCloud.single("avatarURL"), ctrl.updateAvatar);

module.exports = router;