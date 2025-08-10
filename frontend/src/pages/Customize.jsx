import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

const Customize = () => {
  const {
    frontendImage,
    setFrontendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useUserContext();

  const navigate = useNavigate();

  const handleImageClick = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    setSelectedImage(file);
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex flex-col items-center justify-center">
      <MdKeyboardBackspace
        onClick={() => navigate("/")}
        className="text-white text-4xl mb-4 cursor-pointer absolute left-10 top-10"
      />
      <h1 className="text-white text-4xl mb-4">Select Your Assistant Image</h1>
      <div className="w-[90%] mx-auto max-w-[60%] flex flex-wrap justify-center items-center gap-4 p-4">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div className="relative">
          <input
            onChange={handleImageClick}
            accept="image/*"
            type="file"
            className=" w-[150px] h-[250px] bg-cover bg-center bg-[#030326] border-2 border-[#2200ffa0] overflow-hidden rounded-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white "
          />
          {!frontendImage && (
            <RiImageAddLine className="size-8 text-white text-4xl absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2" />
          )}
          {frontendImage && (
            <img
              src={frontendImage}
              alt="Selected"
              className="h-full object-cover absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-[#002fff66] cursor-pointer"
            />
          )}
        </div>
      </div>
      {selectedImage && (
        <button
          onClick={() => navigate("/customize2")}
          className="bg-white text-black py-2 px-10 rounded-full hover:bg-blue-600 cursor-pointer"
        >
          Next
        </button>
      )}
    </div>
  );
};
export default Customize;
