const mongoose = require("mongoose");

// const databaseName = "task-manager";
// const connectionURL = process.env.MONGODB_URL;
const connectionURL =
  "mongodb+srv://usertelegram:hieu12345@cluster0.6ogoq4t.mongodb.net/telegramusers";

mongoose.connect(connectionURL, (err) => {
  if (err) console.log(err);
  console.log("connected to database");
});

const User = mongoose.model("User", {
  name: { type: String },
  chat_id: { type: Number },
  status: { type: String },
  // notification: { type: Array },
  phone: { type: Number },
  // boolean: { type: Boolean },
});

// const me = new User({
//   result: {
//     name: "hieu",
//     age: 26,
//   },
// });

// me.save();

module.exports = { User };
