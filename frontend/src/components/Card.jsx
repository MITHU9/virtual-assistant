import { useUserContext } from "../context/UserContext";

const Card = ({ image }) => {
  const {
    frontendImage,
    setFrontendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useUserContext();

  return (
    <div
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
      className={`w-[150px] h-[250px] bg-cover bg-center bg-[#030326] border-2 border-[#2200ffa0] overflow-hidden rounded-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${
        selectedImage == image
          ? "border-4 border-white shadow-blue-950 shadow-2xl"
          : null
      }`}
    >
      <img
        src={image}
        alt="Card"
        className="w-full h-full object-cover rounded-2xl"
      />
    </div>
  );
};
export default Card;

