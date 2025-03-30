import userModel from "../models/user.js";
import { check } from "../middlewares/isValed.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// بررسی اعتبار داده‌ها
const isValedReqBody = async (body) => {
  const isValed = await check(body);

  if (isValed !== true) {
    const errors = isValed.map((err) => ({
      field: err.field,
      message: err.message,
    }));

    throw { status: 400, errors };
  }
};
// بررسی وجود کاربر
const checkUserExists = async (userName, email) => {
  const isUserExists = await userModel.findOne({
    $or: [{ userName }, { email }],
  });
  if (isUserExists) {
    throw {
      status: 409,
      message: "ایمیل یا نام کاربری از قبل استفاده شده است",
    };
  }
};

// هش کردن رمز عبور
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 12);
};

//* Create NewUser
const createUser = async (data) => {
  const countUsers = await userModel.countDocuments();
  const role = countUsers > 0 ? "USER" : "ADMIN";
  const user = await userModel.create({ ...data, role });

  if (!user) {
    throw {
      status: 500,
      message: "Something went wrong. Please try again later.",
    };
  }
  return user;
};

//* Register User
export const register = async (req, res) => {
  try {
    const { fullName, userName, email, password, phone } = req.body;

    await isValedReqBody(req.body);
    await checkUserExists(userName, email);

    const hashPWD = hashPassword(password);

    const user = await createUser({
      fullName,
      userName,
      email,
      password: hashPWD,
      phone,
    });

    //* حذف فیلد های حساس از پاسخ
    const newUser = user.toObject();
    delete newUser.password;
    delete newUser.__v;

    //* ایجاد توکن
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30 day",
    });

    //* ارسال پاسخ موفقیت آمیز
    res.status(200).json({ success: true, newUser, token });

    //* مدیریت خطاها
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      errors: error.errors || [{ message: "مشکلی در سمت سرور رخ داده است." }],
    });
  }
};
