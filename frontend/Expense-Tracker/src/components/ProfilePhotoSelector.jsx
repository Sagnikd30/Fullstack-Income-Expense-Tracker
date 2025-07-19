import { useRef } from "react";
import { FiTrash2 } from "react-icons/fi";

export default function ProfilePhotoSelector({ selectedImage, setSelectedImage }) {
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setSelectedImage(null);
    fileInputRef.current.value = "";
  };

  return (
    <div className="flex items-center justify-center relative">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageChange}
      />

      <div
        className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed cursor-pointer"
        onClick={() => fileInputRef.current.click()}
      >
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Profile Preview"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm text-gray-500">Upload</span>
        )}
      </div>

      {selectedImage && (
        <button
          onClick={handleRemove}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
        >
          <FiTrash2 size={14} />
        </button>
      )}
    </div>
  );
}
