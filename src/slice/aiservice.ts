// fetchImage.ts
import { API_BASE_URL } from "../assets/apiurl";
import CryptoJS from "crypto-js";

export const fetchAiData = (params: { [key: string]: any }) => {
  const currentDate = new Date();
  let secretKey = currentDate.toISOString().slice(0, 13);

  // 确保密钥长度为16字节
  secretKey = secretKey.padEnd(16, "0"); // 用 '0' 填充到16字节

  const nonce = "1234567890123456"; // 固定 nonce
  const username = params.query.username;

  // 使用 CBC 模式和固定 IV 加密用户名
  const encryptedUsername = CryptoJS.AES.encrypt(
    username,
    CryptoJS.enc.Utf8.parse(secretKey),
    {
      iv: CryptoJS.enc.Utf8.parse(nonce),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
  const updatedParams = {
    ...params,
    username: encryptedUsername,
    nonce: nonce, // 将 `nonce` 也发送给后端
  };
  return fetch(`${API_BASE_URL}/api/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedParams),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};
