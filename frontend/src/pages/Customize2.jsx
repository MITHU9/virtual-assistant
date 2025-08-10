import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
  const { user, setUser, serverUrl, backendImage, selectedImage } =
    useUserContext();
  const [name, setName] = useState(user?.assistantName || "");

  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    try {
      let formData = new FormData();
      formData.append("assistantName", name);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else if (selectedImage) {
        formData.append("imageUrl", selectedImage);
      }

      // console.log(formData);

      const response = await axios.put(`${serverUrl}/user/update`, formData, {
        withCredentials: true,
      });

      const data = response.data;
      setUser(data.user);
      navigate("/");
    } catch (error) {
      console.error("Error updating assistant:", error);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex flex-col items-center justify-center">
      <MdKeyboardBackspace
        onClick={() => navigate("/customize")}
        className="text-white text-4xl mb-4 cursor-pointer absolute left-10 top-10"
      />
      <h1 className="text-white text-4xl mb-4">
        Enter your <span className="text-blue-800">Assistant's Name</span>
      </h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-transparent border-1 border-white text-white py-2 px-4 focus:outline-none w-[500px] rounded-full mt-4"
        type="text"
        placeholder="eg. Jarvis"
        required
      />
      {name && (
        <button
          onClick={handleUpdateAssistant}
          className="bg-white text-black py-2 px-10 rounded-full font-semibold hover:bg-blue-600 cursor-pointer mt-4"
        >
          Finally Create Your Assistant
        </button>
      )}
    </div>
  );
};
export default Customize2;
