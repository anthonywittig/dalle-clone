import { useState, useRef } from "react";
import React from "react";

interface Props {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  selectedImage: File | null;
  generateVariations: () => void;
}

const Modal = ({
  setModalOpen,
  selectedImage,
  setSelectedImage,
  generateVariations,
}: Props) => {
  const [error, setError] = useState("");
  const ref = useRef<HTMLImageElement>(null);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const checkSize = () => {
    if (
      ref.current &&
      ref.current.width == 1024 &&
      ref.current.height == 1024
    ) {
      generateVariations();
      return;
    }
    setError("Error: choose a 1024 x 1024 image");
  };

  return (
    <div className="modal">
      <div onClick={closeModal}>X</div>
      <div className="img-container">
        {selectedImage && (
          <img ref={ref} src={URL.createObjectURL(selectedImage)} />
        )}
      </div>
      <p>{error || "* Image must be 1024 x 1024."}</p>
      {!error && <button onClick={checkSize}>Generate</button>}
      {error && <button onClick={closeModal}>Close and try again!</button>}
    </div>
  );
};

export { Modal };
