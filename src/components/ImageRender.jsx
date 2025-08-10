import React, { useState, useEffect } from "react";
import { createWorker } from "tesseract.js";

function OcrComponent() {
  const [ocrResult, setOcrResult] = useState("Recognizing...");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const doOcr = async () => {
      if (imageFile) {
        const worker = await createWorker("eng", 1, {
          logger: (m) => console.log(m), // Optional: log progress
        });
        const {
          data: { text },
        } = await worker.recognize(imageFile);
        setOcrResult(text);
        await worker.terminate();
      }
    };

    doOcr();
  }, [imageFile]);

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
      setOcrResult("Recognizing..."); // Reset result on new image
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      <p>OCR Result:</p>
      <pre>{ocrResult}</pre>
    </div>
  );
}

export default OcrComponent;
