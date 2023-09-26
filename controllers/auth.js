const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;


const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).exec();

  if (!user) {
    HttpError(409, "Email already in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);

	const avatarURL = gravatar.url(email);

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).exec();

  if (!user) {
    HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;

  res.status(200).json({
    email,
    name,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
};

const updateWeigth = async (req, res) => {
  const { _id } = req.user;
  const { weigth } = req.body;
  
  const result = await User.findByIdAndUpdate(
    _id,
    { weigth },
    {
      new: true,
    }
  );

  if (!result) {
    throw HttpError(400, "Bad Request");
  }

  res.status(200).json({weigth: result.weight});
};

const updateSettings = async (req, res) => {
  const { _id } = req.user;
  const data = req.body;

  const result = await User.findByIdAndUpdate(_id, data, {
    new: true,
  });

  if (!result) {
    throw HttpError(400, "Bad Request");
  }

  res.status(200).json(result);
};

const updateGoal = async (req, res) => {
  const { _id } = req.user;
  const { goal } = req.body;

  const result = await User.findByIdAndUpdate(
    _id,
    { goal },
    {
      new: true,
    }
  );

  if (!result) {
    throw HttpError(400, "Bad Request");
  }

  res.status(200).json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
	const avatarURL = req.file.path;
	const result = await User.findByIdAndUpdate(_id, {avatarURL});

  if(!result) {
    throw HttpError(400, "Bad Request");
  }

	res.status(200).json({
		avatarURL,
	})
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateWeigth: ctrlWrapper(updateWeigth),
  updateSettings: ctrlWrapper(updateSettings),
  updateGoal: ctrlWrapper(updateGoal),
  updateAvatar: ctrlWrapper(updateAvatar),
};
