import React, { useReducer, useState, useRef, useContext } from "react";
import { Row, Button, Typography } from 'antd';

// Import @tensorflow/tfjs
import * as tf from '@tensorflow/tfjs';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';

import '../App.css';

import { formatResultBacteriaVirus } from '../utils/formatter';
import { PatientContext } from '../providers';


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

console.log(tf.getBackend());

const { Title } = Typography;


export default () => {
    const [appState, dispatch] = useReducer(reducer, stateMachine.initial);
    const [model, setModel] = useState(null)
    // const [imageUrl, setImageUrl] = useState(null);
    const [imageUrl, imageFn, setImageFn, setImageUrl] = useContext(PatientContext);
    const inputRef = useRef();
    const [results, setResults] = useState([]);
    const imageRef = useRef();

    const next = () => dispatch("next")

    const loadModel = async ({ modelName = 'bacteria-vs-virus' }) => {
        next();

        const listModel = await tf.io.listModels();
        console.debug({ listModel });

        const getModel = async () => {
            if (listModel[`indexeddb://${modelName}-model`]) {
                console.info(`Load saved model: ${modelName}`);
                const model = await tf.loadLayersModel(`indexeddb://${modelName}-model`);
                // console.debug(model.summary());
                return model
            } else {
                console.info(`Load model: ${modelName}`);
                const model = await tf.loadLayersModel(`${modelName}.uint8/model.json`);
                console.info(`Save model: ${modelName}`);
                await model.save(`indexeddb://${modelName}-model`);
                // console.debug(model.summary());
                return model
            }
        }

        console.debug({ listModel });


        const model = await getModel();
        // console.debug(model.summary());
        console.info("Model loaded");
        setModel(model);
        console.info("Set model");
        next();
    }


    const handleUpload = event => {
        const { files } = event.target;
        if (imageUrl && imageFn) {
            setImageFn(imageFn);
            setImageUrl(imageUrl);
            next();
        } else if (files.length > 0) {
            const name = files[0].name;
            const url = URL.createObjectURL(files[0]);
            setImageFn(name);
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
        awaitingUpload: { text: !(imageUrl && imageFn) ? "Upload Image" : "Use Previous Image", 
                          action: () => !(imageUrl && imageFn) ? inputRef.current.click() : next() },
        ready: { text: "Identify", action: identify },
        classifying: { text: "Identifying…", action: () => { } },
        complete: { text: "Reset", action: reset }
    };

    const { showImage = false, showResults = false } = stateMachine.states[appState];

    return (
        <div>
            <Row>
                <Title level={4}>Diagnosing Pneumonia Bacteria or Virus</Title>
            </Row>
            <Row>
                {showImage && <img src={imageUrl} alt="upload-preview" ref={imageRef} style={{display: 'none'}}/>}
                {showResults && (formatResultBacteriaVirus(Array.from(results.dataSync())[0]))}
            </Row>
            <Row>
                <input style={{display: "none"}} type="file" accept="image/*" capture="camera" ref={inputRef} onChange={handleUpload}></input>
                <Button onClick={buttonProps[appState].action}>
                    {buttonProps[appState].text}
                </Button>
            </Row>
        </div>
    );
};