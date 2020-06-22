import React from "react";
import './App.css';

import { PatientProvider, StatemachineProvider } from './providers';
import Main from './pages/Main';

const App = () => {
  return (
    <>
      <StatemachineProvider>
        <PatientProvider>
          <Main />
        </PatientProvider>
      </StatemachineProvider>
    </>
  );
}
export default App;