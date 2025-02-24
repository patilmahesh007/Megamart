import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const createMessage = async (phone, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, 
      to: phone,
    });

    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export default createMessage;
