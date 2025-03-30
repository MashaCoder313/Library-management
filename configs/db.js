import mongoose from "mongoose";

const URL = "mongodb://localhost:27017/light_effect";

mongoose
  .connect(URL)
  .then(console.log("Connected To db Successfully✅."))
  .catch((err) => {
    console.log(err);
  });
