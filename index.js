const express = require("express");
const phoneNumber = require("./phoneNumber");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { User } = require("./db/mongoose");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// ------------------------

const sendMessage = (chat_id, message) => {
  const URL = process.env.URL;
  const TOKEN = process.env.TOKEN;
  const method = "sendMessage";

  fetch(
    `${URL}/bot${TOKEN}/${method}?chat_id=${chat_id}&text=${message}&parse_mode=HTML`
  );
};

// ------------------------

app.post("/", async (req, res) => {
  const message = req.body.message;
  const chat_id = req.body.message.chat.id;
  const startMessage =
    "You can control me by sending these commands:                         " +
    "/active - get notifications";

  // const startMessage = `202Successfully active notification2-10-07 11:55:59 Mã Giá cước ĐHVC mới số GDHVC0000002 <b>đang xin duyệt giá</b>`;
  const activeMessage = "Please provide me your phone number";
  // ------------------------

  const isUser = await User.findOne({ chat_id: chat_id });
  const isSuccess = isUser?.status === "success";

  if (isSuccess) {
    sendMessage(chat_id, `You already register`);
    return res.send("hello you");
  }

  if (message.text === "/start") {
    sendMessage(chat_id, startMessage);
    return res.send("hello you");
  }

  if (message.text === "/active" && isUser?.status !== "success") {
    await User({
      name: message.chat?.last_name + " " + message.chat?.first_name,
      chat_id: Number(chat_id),
      status: "active",
    }).save();
    sendMessage(chat_id, activeMessage);
    return res.send("hello you");
  }
  if (isUser.status === "active") {
    const isValid =
      message.text.length === 10 &&
      phoneNumber.some((phone) => phone == message.text);

    if (isValid) {
      isUser.phone = Number(message.text);
      isUser.status = "success";
      await isUser.save();
      sendMessage(chat_id, `Successfully active notification`);
      return res.send("hello you");
    }
    sendMessage(
      chat_id,
      `Your phone number is wrong, please provide your phone number`
    );
  }

  return res.send("hello you");
});

app.get("/", (req, res) => {
  res.send("Hello 70");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
