const express = require("express");
const router = express.Router();


const ctrl = require("../../controllers/healthyMeals.js");
const {validateBody, isValidId, authenticate} = require("../../middlewares");
const {schemas} = require("../../models/healthyMeal");
const jsonParser = express.json();



router.get('/', authenticate, ctrl.listHealthyDay);

router.get('/statistic', authenticate, ctrl.listStatistics);

router.post('/', authenticate, jsonParser, validateBody(schemas.addDaySchema), ctrl.addHealthyDay);

router.put('/water-intake', authenticate, jsonParser, validateBody(schemas.addWaterSchema), ctrl.addDrunkWater);

router.get('/:id', authenticate, isValidId, ctrl.listFoodbyId);

router.post('/food-intake/:meal', jsonParser, authenticate, validateBody(schemas.addMealSchema), ctrl.addMealToDay);

router.put('/food-intake/:meal/:id', jsonParser, authenticate, isValidId, validateBody(schemas.addMealSchema), ctrl.updateMealToDay);

router.delete('/food-intake/:meal/:id', authenticate, isValidId, ctrl.removeMeal);




module.exports = router;