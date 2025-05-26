import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";

const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const createUser = await User.create({ name, email, password });

  res.status(200).json({
    message: "success",
    data: createUser,
  });
});

export { register };
