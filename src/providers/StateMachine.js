import React, { useReducer, createContext } from "react";


export const stateMachine = {
    initial: "initial",
    states: {
        // prediction stage
        initial: { on: { next: "loadingModel" }, text: 'Load Model'},
        loadingModel: { on: { next: "awaitingUpload"}, text: 'Loading Model'},
        awaitingUpload: { on: { next: "ready" }, text: 'Upload Image'},
        ready: { on: { next: "classifying" }, showImage: true },
        classifying: { on: { next: "complete" } },
        complete: { on: { next: "awaitingUpload" }, text: 'Upload Image', showImage: true, showResults: true },
    }
};

export const reducer = (currentState, event) => stateMachine.states[currentState].on[event] || stateMachine.initial;

export const StatemachineContext = createContext();

export const StatemachineProvider = props => {
    const [appState, dispatch] = useReducer(reducer, stateMachine.initial);

    return (
        <StatemachineContext.Provider value={[appState, dispatch]}>
            {props.children}
        </StatemachineContext.Provider>
    );
};