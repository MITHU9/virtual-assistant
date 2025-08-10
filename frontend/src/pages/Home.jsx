import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ai from "../assets/ai.gif";
import userImg from "../assets/user.gif";

const Home = () => {
  const { user, serverUrl, setUser, getGeminiRes } = useUserContext();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);

  const synth = window.speechSynthesis;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${serverUrl}/auth/logout`,
        {},
        { withCredentials: true }
      );
      console.log(response.data);
      navigate("/signin");
      setUser(null);
    } catch (error) {
      setUser(null);
      console.error("Error logging out:", error);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    isSpeakingRef.current = true;
    utterance.lang = "en-US";

    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;

      safeRecognition();
    };

    synth.cancel(); // Cancel any ongoing speech
    synth.speak(utterance);
  };

  const handleCommand = async (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google_search") {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
        "_blank"
      );
    } else if (type === "youtube_search" || type === "youtube_play") {
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          userInput
        )}`,
        "_blank"
      );
    } else if (type === "instagram_open") {
      window.open("https://www.instagram.com/", "_blank");
    } else if (type === "facebook_open") {
      window.open("https://www.facebook.com/", "_blank");
    } else if (type === "weather-show") {
      window.open("https://www.google.com/search?q=weather", "_blank");
    } else if (type === "calculator_open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
    }
  };

  const safeRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Speech recognition started");
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Error starting speech recognition:", error);
        }
      }
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported");
      return;
    }

    let hasGreeted = false;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      console.log("Speech recognition activated");
      setListening(true);

      if (!hasGreeted && user?.name) {
        hasGreeted = true;
        const greeting = new SpeechSynthesisUtterance(
          `Hello! ${user.name}. How can I assist you today?`
        );
        greeting.lang = "en-US";
        window.speechSynthesis.speak(greeting);
      }
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      console.log("Speech recognition deactivated");
      setListening(false);
      if (!isSpeakingRef.current) {
        setTimeout(safeRecognition, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(safeRecognition, 1000);
      }
    };

    recognition.onresult = async (event) => {
      const command =
        event.results[event.results.length - 1][0].transcript.trim();
      console.log("Voice command:", command);

      if (
        user &&
        command.toLowerCase().includes(user.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(command);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiRes(command);
        console.log("Gemini response:", data);
        handleCommand(data);
        setAiText(data?.response);
        setUserText("");
      }
    };

    safeRecognition();

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition();
      }
    }, 5000);

    return () => {
      recognition.stop();
      clearInterval(fallback);
      setListening(false);
      isRecognizingRef.current = false;
      isSpeakingRef.current = false;
    };
  }, [user, getGeminiRes]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex flex-col items-center justify-center">
      <button
        onClick={handleLogout}
        className="bg-white text-black py-2 px-4 rounded-full mt-4 absolute top-10 right-10 cursor-pointer"
      >
        Log Out
      </button>
      <button
        onClick={() => navigate("/customize")}
        className="bg-white text-black py-2 px-4 rounded-full mt-4 absolute top-[120px] right-10 cursor-pointer"
      >
        Edit Assistant
      </button>
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl">
        <img
          src={user?.assistantImage}
          alt={user?.assistantName}
          className="h-full object-cover"
        />
      </div>
      <h1 className="text-white text-4xl mt-4">I'm {user?.assistantName}</h1>
      {!aiText && <img src={userImg} alt="User" className="w-[200px]" />}
      {aiText && (
        <>
          <img src={ai} alt="AI" className="w-[200px]" />
        </>
      )}

      <h1 className="text-white text-xl mt-4">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
};

export default Home;
