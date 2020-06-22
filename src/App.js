import React, { useReducer, useState, useRef } from "react";
// Import @tensorflow/tfjs
import * as tf from '@tensorflow/tfjs';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';

import './App.css';

import { PneumoniaNormal, VirusCovidNoncovid } from './models';

const App = () => {
  return (
    <>
      <h1>XR & CT COVID-19 Screening</h1>
      <PneumoniaNormal></PneumoniaNormal>
      <VirusCovidNoncovid/>
    </>
  );
}
export default App;