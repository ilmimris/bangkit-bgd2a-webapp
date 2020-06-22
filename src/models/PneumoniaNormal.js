import React, { useState, useContext } from "react";
import { Row, Button, Typography } from 'antd';

// Import @tensorflow/tfjs
import * as tf from '@tensorflow/tfjs';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';

import { formatResultPneumonia } from '../utils/formatter';
import { PatientContext, StatemachineContext, stateMachine } from '../providers';

// console.log(tf.getBackend());

const { Title } = Typography;

export default () => {
    const [appState, dispatch] = useContext(StatemachineContext);
    const [model, setModel] = useState(null)
    const [
        , ,
        setImageFn, setImageUrl,
        inputRef, imageRef
    ] = useContext(PatientContext);

    const [results, setResults] = useState([]);

    const next = () => dispatch("next")

    const loadModel = async ({ modelName = 'pneumonia-vs-normal' }) => {
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
        if (files.length > 0) {
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
        awaitingUpload: { text: "Upload Image", action: () => inputRef.current.click() },
        ready: { text: "Identify", action: identify },
        classifying: { text: "Identifying…", action: () => { } },
        complete: { text: "Reset", action: reset }
    };

    const { showResults = false } = stateMachine.states[appState];

    return (
        <div>
            <Row>
                <Title level={4}>Diagnosing Pneumonia</Title>
            </Row>
            <Row>
                {showResults && (formatResultPneumonia(Array.from(results.dataSync())[0]))}
            </Row>
            <Row>
                <input type="file" accept="image/*" capture="camera" ref={inputRef} onChange={handleUpload}></input>
                <Button onClick={buttonProps[appState].action}>
                    {buttonProps[appState].text}
                </Button>
            </Row>
        </div>
    );
};