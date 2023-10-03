const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const mealsSchema = new Schema({
  title: String,
  carbohydrates: Number,
  protein: Number,
  fat: Number,
  calories: Number,
});

const healthySchema = new Schema({
  date: {
    type: Date,
    default: new Date(),
  },
  water: {
    type: Number,
    default: 0,
  },
  weight: {
    type: Number,
    default: 0,
  },
  breakfast: [mealsSchema],
  lunch: [mealsSchema],
  dinner: [mealsSchema],
  snack: [mealsSchema],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

healthySchema.post("save", handleMongooseError);

const addMealSchema = Joi.object({
  title: Joi.string(),
  carbohydrates: Joi.number(),
  protein: Joi.number(),
  fat: Joi.number(),
  calories: Joi.number(),
});

const addDaySchema = Joi.object({
  water: Joi.number(),
  weight: Joi.number().required(),
  breakfast: Joi.array(),
  lunch: Joi.array(),
  dinner: Joi.array(),
  snack: Joi.array(),
});

const addWaterSchema = Joi.object({
  water: Joi.number().required(),
});

const addWeightSchema = Joi.object({
  weight: Joi.number().required(),
});

const schemas = {
  addMealSchema,
  addDaySchema,
  addWaterSchema,
  addWeightSchema,
};

const Healthy = model("healthymeal", healthySchema);

module.exports = {
  Healthy,
  schemas,
};
