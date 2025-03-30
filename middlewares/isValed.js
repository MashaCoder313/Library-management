import validator from "fastest-validator";

const v = new validator();

const schema = {
  fullName: {
    type: "string",
  },
  userName: {
    type: "string",
    min: 3,
    max: 18,
  },
  email: {
    type: "string",
    pattern: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: "string",
    min: 8,
    max: 24,
  },
  confirmPwd: {
    type: "equal",
    field: "password",
  },
  phone: {
    type: "string",
    pattern: /^\d{10,15}$/,
  },
};

export const check = v.compile(schema);
