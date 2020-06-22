import React from "react";
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