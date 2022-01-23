import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react/cjs/react.development';
import { createWorker } from 'tesseract.js';

function App() {
  const [ocr, setOcr] = useState('');
  const [imageData, setImageData] = useState(null);
  const [progress, setProgress] = useState(0);
  const worker = createWorker({
    logger: (m) => {
      console.log(m);
      setProgress(parseInt(m.progress * 100));
    },
  });
  const convertImageToText = async () => {
    if (!imageData) return;
    //load Tesseract core scripts
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const {
      data: { text },
    } = await worker.recognize(imageData);
    setOcr(text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''));
  };

  useEffect(() => {
    convertImageToText();
  }, [imageData]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      console.log({ imageDataUri });
      setImageData(imageDataUri);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="App">
      <div className="container">
        <h1>Choose an Image</h1>
        <input
          type="file"
          name=""
          id=""
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>
      {progress < 100 && progress > 0 && (
        <div className="progress-container">
          <div className="progress-label">Progress ({progress}%)</div>
          <div className="progress-bar">
            <div
              className="progress bg-info"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      <div className="container">
        <h2>{ocr}</h2>
        <img src={imageData} alt="" srcSet="" />
      </div>
    </div>
  );
}

export default App;
