import React, { useReducer, useState, useRef } from "react";
// Import @tensorflow/tfjs
import * as tf from '@tensorflow/tfjs';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';

import { formatResultCovid } from '../utils/formatter';


export const stateMachine = {
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

export const reducer = (currentState, event) => stateMachine.states[currentState].on[event] || stateMachine.initial;

// console.log(tf.getBackend());

export default () => {
    const [appState, dispatch] = useReducer(reducer, stateMachine.initial);
    const [model, setModel] = useState(null)
    const [imageUrl, setImageUrl] = useState(null);
    const [results, setResults] = useState([]);
    const inputRef = useRef();
    const imageRef = useRef();

    const next = () => dispatch("next")

    const loadModel = async () => {
        next();
        // const vgg16model = await tf.loadLayersModel('tfjs/model.json');
        // setModel(vgg16model)
        console.info(`Load model`);
        // const model = await tf.loadLayersModel(pathModel);
        // const pneumonia_vs_normal = await tf.loadLayersModel('pneumonia-vs-normal.uint8/model.json');
        const model = await tf.loadLayersModel('covid-vs-noncovid.uint8/model.json');
        // console.debug(model.summary());
        console.info("Model loaded");
        // setModel(pneumonia_vs_normal)

        setModel(model);
        console.info("Set model");
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
        const image = tf.browser.fromPixels(imageRef.current, 3);
        // console.log({image});

        const input = image.resizeBilinear([224, 224]).cast('float32').div(tf.scalar(255.0)).expandDims(0)
        // console.log({input});

        const results = await model.predict(input, { batchSize: 1 });
        // console.debug({ results })
        setResults(results);
        next();
    }

    const reset = () => {
        setResults([]);
        setImageUrl(null);
        next();
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
            <h2>Diagnosing Virus COVID19 or Non-COVID19</h2>
            {showImage && <img src={imageUrl} alt="upload-preview" ref={imageRef} />}
            {showResults && (formatResultCovid(Array.from(results.dataSync())[0]))}
            <input type="file" accept="image/*" capture="camera" ref={inputRef} onChange={handleUpload}></input>
            <button onClick={buttonProps[appState].action}>
                {buttonProps[appState].text}
            </button>
        </div>
    );
};