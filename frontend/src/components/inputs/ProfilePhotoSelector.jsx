import React, { useRef, useState, useEffect } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // This effect handles creating and cleaning up the preview URL
  useEffect(() => {
    let objectUrl = null;

    if (image) {
      // 'image' is a File object, create a URL for it
      objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);
    } else {
      // 'image' is null, clear the preview
      setPreviewUrl(null);
    }

    // Cleanup function: This runs when the component unmounts
    // or when the 'image' prop changes *before* the effect runs again.
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [image]); // Re-run this effect only when the 'image' prop changes

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Update the image state in the parent component
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    // Setting image to null will trigger the useEffect to clean up
    setImage(null);
  };

  const onChooseFile = () => {
    // Programmatically click the hidden file input
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        // --- No Image Selected ---
        <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
          <LuUser className="text-4xl text-primary" />

          <button
            type="button"
            // Added 'flex' for icon centering
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        // --- Image is Selected ---
        <div className="relative">
          <img
            src={previewUrl}
            alt="profile photo"
            // Added classes to make the image round and sized correctly
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"
            className="w-8 h-8 flex justify-center items-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;