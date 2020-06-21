import React, { useReducer, useState, useRef } from "react";
// Import @tensorflow/tfjs-core
import * as tf from '@tensorflow/tfjs';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';

import './App.css';


const stateMachine = {
  initial: "initial",
  states: {
    initial: { on: { next: "loadingModel", text: 'Load Model' } },
    loadingModel: { on: { next: "awaitingUpload", text: 'Loading Model' } },
    awaitingUpload: { on: { next: "ready" } },
    ready: { on: { next: "classifying" }, showImage: true },
    classifying: { on: { next: "complete" } },
    complete: { on: { next: "awaitingUpload" }, showImage: true, showResults: true }
  }
};
const reducer = (currentState, event) => stateMachine.states[currentState].on[event] || stateMachine.initial;

console.log(tf.getBackend());

const App = () => {
  const [appState, dispatch] = useReducer(reducer, stateMachine.initial);
  const [model, setModel] = useState(null)
  const [imageUrl, setImageUrl] = useState(null);
  const [results, setResults] = useState([]);
  const inputRef = useRef();
  const imageRef = useRef();

  const next = () => dispatch("next")

  const loadModel = async () => {
    next();
    const vgg16model = await tf.loadLayersModel('tfjs/model.json');
    setModel(vgg16model)
    next();
  }

  const handleUpload = event => {
    const { files } = event.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
      next();
    }
  }

  const identify = async () => {
    next();
    const image = tf.browser.fromPixels(imageRef.current, 3)
      .resizeBilinear([224, 224])
      .cast('float32')
      .div(tf.scalar(255.0))
      .expandDims(0);

    const results = await model.predict(image, { batchSize: 1 });
    // console.debug({ results })
    setResults(results);
    next();
  }

  const reset = () => {
    setResults([]);
    setImageUrl(null);
    next();
  }

  const formatResultCovid = num => {
    return (
      <>
        <li key="COVID-19-">
          {`COVID-19 (Negative): ${(num * 100).toFixed(2)}%`}
        </li>
        <li key="COVID-19+">
          {`COVID-19 (Positive): ${((1 - num) * 100).toFixed(2)}%`}
        </li>
        <br/>
      </>
    )
  }
  const buttonProps = {
    initial: { text: "Load Model", action: loadModel },
    loadingModel: { text: "Loading Model…", action: () => { } },
    awaitingUpload: { text: "Upload Image", action: () => inputRef.current.click() },
    ready: { text: "Identify", action: identify },
    classifying: { text: "Identifying…", action: () => { } },
    complete: { text: "Reset", action: reset }
  };

  const { showImage = false, showResults = false } = stateMachine.states[appState];

  return (
    <div>
      <h1>XR & CT COVID-19 Screening</h1>
      {showImage && <img src={imageUrl} alt="upload-preview" ref={imageRef} />}
      {showResults && (formatResultCovid(Array.from(results.dataSync())[0]))}
      <input type="file" accept="image/*" capture="camera" ref={inputRef} onChange={handleUpload}></input>
      <button onClick={buttonProps[appState].action}>
        {buttonProps[appState].text}
      </button>
    </div>
  );
}
export default App;