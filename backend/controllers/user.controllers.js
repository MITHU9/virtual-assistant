import moment from "moment/moment.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { assistantName, imageUrl } = req.body;

    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const userId = req.userId;
    const { command } = req.body;

    const user = await User.findById(userId);
    user.history.push(command);
    await user.save();

    const userName = user.name;
    const assistantName = user.assistantName;

    const response = await geminiResponse(command, assistantName, userName);

    const jsonMatch = response.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      return res
        .status(400)
        .json({ message: "sorry, i couldn't understand your request" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type || "general";

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("hh:mm:ss")}`,
        });
      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("dddd")}`,
        });
      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current month is ${moment().format("MMMM")}`,
        });
      case "general":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
      case "google_search":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
      case "youtube_search":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
      case "youtube_play":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });
      case "calculator_open":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      case "instagram_open":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      case "facebook_open":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      case "weather-show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        return res.status(400).json({ message: "Unknown command" });
    }
  } catch (error) {
    console.error("Error asking assistant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
