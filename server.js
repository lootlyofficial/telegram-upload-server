const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const app = express();
const upload = multer({ dest: "uploads/" });

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post("/upload", upload.single("file"), async (req, res) => {
 try {
  const file = req.file;

  const formData = new FormData();
  formData.append("chat_id", CHAT_ID);
  formData.append("document", fs.createReadStream(file.path));

  const tg = await axios.post(
   `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
   formData,
   { headers: formData.getHeaders() }
  );

  const file_id = tg.data.result.document.file_id;

  const fileData = await axios.get(
   `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${file_id}`
  );

  const file_path = fileData.data.result.file_path;

  const link =
   `https://api.telegram.org/file/bot${BOT_TOKEN}/${file_path}`;

  res.json({ link });

 } catch (e) {
  res.status(500).send("Upload Failed");
 }
});

app.listen(3000, () => {
 console.log("Server Running");
});

