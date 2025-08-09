import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

const userContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const serverUrl = "http://localhost:5000/api";

  const handleCurrentUser = async () => {
    try {
      const response = await axios.get(`${serverUrl}/user/current`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data.user);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  //console.log(user);

  return (
    <userContext.Provider value={{ user, setUser, serverUrl }}>
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(userContext);
};

export default UserContext;
