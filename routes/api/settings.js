const express = require("express");
const router = express.Router();


const ctrl = require("../../controllers/auth");
const {validateBody, authenticate, uploadCloud} = require("../../middlewares");
const {schemas} = require("../../models/user");
const jsonParser = express.json();



router.patch("/", validateBody(schemas.settingsSchema), jsonParser, authenticate, ctrl.updateSettings);

router.patch("/weight", validateBody(schemas.weightSchema), jsonParser, authenticate, ctrl.updateWeigth);

router.patch("/goal", validateBody(schemas.goalSchema), jsonParser, authenticate, ctrl.updateGoal);

router.patch("/avatars", authenticate,  uploadCloud.single("avatarURL"), ctrl.updateAvatar);

module.exports = router;