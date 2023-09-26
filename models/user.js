const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");


const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Set pawword for userr"]
	},
	gender: {
		type: String,
		enum: ["male", "female"],
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	height: {
		type: Number,
		required: true,
	},
	weight: {
		type: Number,
		required: true,
	},
	goal: {
		type: String,
		enum: ["Lose fat", "Maintain", "Gain Muscle"],
		default: "Lose fat",
	},
	activity: {
		type: Number,
		required: true,
	},
	avatarURL: {
		type: String,
		required: true,
	},
	token: {
		type: String,
		default: "",
	}
}, { versionKey: false, timestamps: true});

userSchema.post("save", handleMongooseError);


const registerSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required(),
	password: Joi.string().min(6).required(),
	gender: Joi.string().required(),
	age: Joi.number().required(),
	height: Joi.number().required(),
	goal: Joi.string().required(),
	activity: Joi.number().required(),
});

const loginSchema = Joi.object({
	email: Joi.string().required(),
	password: Joi.string().min(6).required(),
});

const weigthSchema = Joi.object({
	weight: Joi.number().required(),
});

const settingsSchema = Joi.object({
	name: Joi.string().required(),
	age: Joi.number().required(),
	height: Joi.number().required(),
	weight: Joi.number().required(),
	gender: Joi.string().required(),
	activity: Joi.number().required(),
})

const goalSchema = Joi.object({
	goal: Joi.string().required(),
})

const schemas = {
	registerSchema,
	loginSchema,
	weigthSchema,
	settingsSchema,
	goalSchema
}

const User = model("user", userSchema);

module.exports = {
	User,
	schemas
}