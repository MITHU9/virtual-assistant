import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.

You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON
object like this:

{
    "type": "general" | "google_search" | "youtube_search" | "youtube_play" |
    "get_time" | "get_date" | "get_day" | "get_month"|"calculator_open" |
    "instagram_open" |"facebook_open" |"weather-show",
💡"userInput": "<original user input> {only remove your name from userInput if
exists} and jodi keu google or youtube a kicu search korar kotha bole tahole sudhu
search korar kotha ta userInput e thakbe.",
    "response": "<a short spoken response to read out loud to the user>"

}

Instructions:
- "type": determine the intent of the user.
- "userInput": original sentence the user spoke.
- "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's 
  what I found", "Today is Tuesday", etc.

Type meanings:
- "general": if it's a factual or informational question.
if user asks for a definition or explanation that you can provide, use this type.just give short answer.
- "google_search": if user wants to search something on Google .
- "youtube_search": if user wants to search something on YouTube.
- "youtube_play": if user wants to directly play a video or song.
- "calculator_open": if user wants to open a calculator .
- "instagram_open": if user wants to open instagram .
- "facebook_open": if user wants to open facebook.
- "weather-show": if user wants to know weather
- "get_time": if user asks for current time.
- "get_date": if user asks for current date.
- "get_day": if user asks for current day.
- "get_month": if user asks for current month.

Important:
- Always include the user's original input in the "userInput" field.
- If the user input contains the assistant's name, remove it before placing it in the "userInput" field.
- For search intents (Google, YouTube), only include the search query in the "userInput" field.
-Use "{author name}" if user asked who created you.
-only response with the JSON object, do not include any additional text or explanation.

now your userInput-${command}

`;
    const response = await axios.post(process.env.GEMINI_API_URL, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    throw error;
  }
};

export default geminiResponse;
