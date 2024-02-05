// src/ImageUpload.js
import React, { useState } from "react";

function ImageUpload() {
  const [imageData, setImageData] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryString = event.target.result;
      setImageData(binaryString);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageData && (
        <img src={`data:image/jpeg;base64,${imageData}`} alt="Uploaded" />
      )}
      {imageData}
    </div>
  );
}

export default ImageUpload;
