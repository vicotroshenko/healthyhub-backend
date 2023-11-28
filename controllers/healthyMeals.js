const { HttpError, ctrlWrapper } = require("../helpers");
const { Healthy } = require("../models/healthyMeal");


const dt = new Date();
const currentDate =
  dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();

const getHealthyDay = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Healthy.find(
    { owner },
    "-createdAt -updatedAt"
  ).populate("owner");

  if(!result) {
    throw HttpError(404, "User not foud")
  }

  res.status(200).send(result);
};

const addHealthyDay = async (req, res) => {
  const { _id: owner } = req.user;

  const mealDay = await Healthy.find(
    { owner },
    "-createdAt -updatedAt"
  ).populate("owner");

  const checkRepeatDate = mealDay.find(({ date }) => {
    const gottenDate =
      date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    return gottenDate === currentDate;
  });
  

  if (checkRepeatDate) {
    throw HttpError(404, "The has already create");
  }

  const result = await Healthy.create({ ...req.body, owner });
  res.status(201).json(result);
};

const listFoodbyId = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await Healthy.findById(id, "-createdAt -updatedAt");

  if (!result) {
    throw HttpError(404, "Not found current day");
  }

  res.status(200).json(result);
};

const addDrunkWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { water } = req.body;

  const mealDay = await Healthy.find(
    { owner },
    "-createdAt -updatedAt"
  ).populate("owner");

  if (!mealDay) {
    throw HttpError(404, "Not found");
  }
  const checkRepeatDate = mealDay.find(({ date }) => {
    const gottenDate =
      date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    return gottenDate === currentDate;
  });

  if (!checkRepeatDate) {
    throw HttpError(404, "Not found current day");
  }

  const result = await Healthy.findByIdAndUpdate(
    checkRepeatDate.id,
    { $inc: { water } },
    {
      new: true,
    }
  ).exec();

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({water: result.water, date: result.date});
};

const addMealToDay = async (req, res) => {
  const { _id: owner } = req.user;
  const { meal } = req.params;

  const mealDay = await Healthy.find({ owner });

  const checkRepeatDate = mealDay.find(({ date }) => {
    const gottenDate =
      date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    return gottenDate === currentDate;
  });

  if (!checkRepeatDate) {
    throw HttpError(404, "Not found current day");
  }

  const result = await Healthy.findByIdAndUpdate(
    checkRepeatDate._id,
    { $push: { [meal]: req.body } },
    {
      new: true,
    }
  ).exec();

  if (!result) {
    throw HttpError(400, "Files did not add");
  }

  res.status(200).json(result);
};


const updateMealToDay = async (req, res) => {
  const { _id: owner } = req.user;
  const { id, meal } = req.params;

  const [healthyDay] = await Healthy.find({ [`${meal}._id`]: id, owner });

  if (!healthyDay) {
    throw HttpError(404, `Not found ${meal}`);
  }

  const index = healthyDay[meal].findIndex((item) => item.id === id);

  if (index === -1) {
    throw HttpError(404, `Not found ${meal}`);
  }

  Object.assign(healthyDay[meal][index], req.body);

  const result = await Healthy.findByIdAndUpdate(healthyDay._id, healthyDay, {
    new: true,
  }).exec();

  if (!result) {
    throw HttpError(400, "filed did not update");
  }

  res.status(200).json(result);
};


const updateWeightToDay = async (req, res) => {
  const { _id: owner } = req.user;
  const { weight } = req.body;

  const mealDay = await Healthy.find(
    { owner },
    "-createdAt -updatedAt"
  ).populate("owner");

  const checkRepeatDate = mealDay.find(({ date }) => {
    const gottenDate =
      date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    return gottenDate === currentDate;
  });
  

  if (!checkRepeatDate) {
    throw HttpError(404, "Not found day");
  }
  
  const result = await Healthy.findByIdAndUpdate(checkRepeatDate._id, {weight}, {
    new: true,
  }).exec();

  if (!result) {
    throw HttpError(400, "filed did not update");
  }

  res.status(200).json({id: result._id, weight: result.weight, date: result.date});
};


const removeMeal = async (req, res) => {
  const { _id: owner } = req.user;
  const { id, meal } = req.params;

  const [healthyDay] = await Healthy.find({ [`${meal}._id`]: id, owner });

  if (!healthyDay) {
    throw HttpError(404, `Not found ${meal}`);
  }

  const index = healthyDay[meal].findIndex((item) => item.id === id);

  if (index === -1) {
    throw HttpError(404, `Not found ${meal}`);
  }

  healthyDay[meal].splice(index, 1);

  const result = await Healthy.findByIdAndUpdate(healthyDay._id, healthyDay, {
    new: true,
  }).exec();

  if (!result) {
    throw HttpError(400, "filed did not delete");
  }

  res.json({
    message: "successful deleted",
  });
};


const listStatistics = async (req, res) => {
  const { month, year } = req.query;
  const { _id: owner } = req.user;

  let startDate = new Date();
  let endDate = new Date();
  const monthNum = Number(month);
  const yearNum = Number(year);

  if (monthNum !== 0) {
    startDate = new Date(Number(yearNum), Number(monthNum) - 1, 1, 3);
    endDate = new Date(
      new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)
    );
  }

  if (monthNum > 12) {
    throw HttpError(404, "Not found. A year contains 12 months");
  }

  if (monthNum === 0 && yearNum) {
    const currentYear = new Date().getFullYear();
    startDate = new Date(
      new Date().setFullYear(
        new Date().getFullYear() - ((currentYear +1) - Number(yearNum))
      )
    );
    console.log("startDate", startDate);
    endDate = new Date();
  }

  if (!yearNum && !monthNum) {
    console.log(4);
    startDate = new Date(1970);
    endDate = new Date();
  }

  let diaryByDays = await Healthy.aggregate([
    {
      $match: {
        owner,
        date: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $project: {
        date: "$date",
        weight: { $sum: "$weight" },
        water: { $sum: "$water" },
        owner: "$owner",
        breakfast: [
          {
            fat: { $sum: "$breakfast.fat" },
            carbohydrates: { $sum: "$breakfast.carbohydrates" },
            protein: { $sum: "$breakfast.protein" },
            calories: { $sum: "$breakfast.calories" },
          },
        ],
        lunch: [
          {
            fat: { $sum: "$lunch.fat" },
            carbohydrates: { $sum: "$lunch.carbohydrates" },
            protein: { $sum: "$lunch.protein" },
            calories: { $sum: "$lunch.calories" },
          },
        ],
        dinner: [
          {
            fat: { $sum: "$dinner.fat" },
            carbohydrates: { $sum: "$dinner.carbohydrates" },
            protein: { $sum: "$dinner.protein" },
            calories: { $sum: "$dinner.calories" },
          },
        ],
        snack: [
          {
            fat: { $sum: "$snack.fat" },
            carbohydrates: { $sum: "$snack.carbohydrates" },
            protein: { $sum: "$snack.protein" },
            calories: { $sum: "$snack.calories" },
          },
        ],
      },
    },
  ]);
  res.status(200).json(diaryByDays);
};


module.exports = {
	getHealthyDay: ctrlWrapper(getHealthyDay),
  addHealthyDay: ctrlWrapper(addHealthyDay),
  listFoodbyId: ctrlWrapper(listFoodbyId),
  addDrunkWater: ctrlWrapper(addDrunkWater),
  addMealToDay: ctrlWrapper(addMealToDay),
  updateMealToDay: ctrlWrapper(updateMealToDay),
  removeMeal: ctrlWrapper(removeMeal),
	listStatistics: ctrlWrapper(listStatistics),
	updateWeightToDay: ctrlWrapper(updateWeightToDay),
};
