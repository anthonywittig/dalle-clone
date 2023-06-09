import { ChangeEvent, useState } from "react";
import { Modal } from "./components/Modal";

interface Image {
  url: string;
}

function App() {
  const [images, setImages] = useState<Image[]>([]);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const surpriseOptions = [
    "A blue ostrich eatting melon",
    "A matisse style shark on the telephone",
    "A pineapple sunbathing on an island",
  ];

  const surpriseMe = () => {
    setImages([]);
    setValue(
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    );
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target || !event.target.files) return;

    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    setModalOpen(true);
    setSelectedImage(event.target.files[0]);
    event.target.value = "";

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  };

  const generateVariations = async () => {
    setImages([]);
    if (!selectedImage) {
      setError("oh no!");
      setModalOpen(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/variations", {
        method: "POST",
      });
      const data = await response.json();
      // console.log(data);
      setImages(data);
      setError("");
      setModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const getImages = async () => {
    setImages([]);
    if (!value) {
      setError("oh no!");
      return;
    }
    setError("");

    try {
      const response = await fetch("http://localhost:8000/images", {
        method: "POST",
        body: JSON.stringify({
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);
      setImages(data);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="app">
      <section className="search-section">
        <p>
          Start with a detailed description{" "}
          <span className="surprise" onClick={surpriseMe}>
            Surprise me
          </span>
        </p>
        <div className="input-container">
          <input
            placeholder="An impressionist oil painting of a sunflower in a purple vase.."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={getImages}>Generate</button>
        </div>
        <p className="extra-info">
          Or,{" "}
          <span>
            <label htmlFor="files">upload an image </label>
            <input
              onChange={uploadImage}
              id="files"
              type="file"
              accept="image"
              hidden
            />
            to edit.
          </span>
        </p>
        {error && <p className="error">{error}</p>}
        {modalOpen && (
          <div className="overlay">
            <Modal
              setModalOpen={setModalOpen}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              generateVariations={generateVariations}
            />
          </div>
        )}
      </section>
      <section className="image-section">
        {images?.map((image, _index) => (
          <img src={image.url} key={_index} alt={`${value}`} />
        ))}
      </section>
    </div>
  );
}

export default App;
