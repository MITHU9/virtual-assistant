import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

const userContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const serverUrl = "https://virtual-assistant-backend-3f5p.onrender.com/api";
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const response = await axios.get(`${serverUrl}/user/current`, {
        withCredentials: true,
      });

      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const getGeminiRes = async (command) => {
    try {
      const response = await axios.post(
        `${serverUrl}/user/ask`,
        { command },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Gemini response:", error);
      return null;
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  console.log(user);

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        serverUrl,
        frontendImage,
        setFrontendImage,
        backendImage,
        setBackendImage,
        selectedImage,
        setSelectedImage,
        getGeminiRes,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(userContext);
};

export default UserContext;
