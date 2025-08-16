import * as line from "@line/bot-sdk";
import dotenv from "dotenv";
dotenv.config();

export const client = new line.Client({
  channelAccessToken: process.env.token,
  channelSecret: process.env.secretcode,
});

export const handleLineEvent = async (event) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  const userId = event.source.userId;
  console.log("User ID:", userId);

  // ตอบกลับข้อความ
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: "คุณพิมพ์ว่า: " + event.message.text,
  });
};
