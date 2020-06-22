import React, { useState, useRef, createContext } from "react";

export const PatientContext = createContext();

export const PatientProvider = props => {
  const [imageUrl, setImageUrl] = useState();
  const [imageFn, setImageFn] = useState();
  const inputRef = useRef();
  const imageRef = useRef();

  return (
    <PatientContext.Provider value={[imageUrl, imageFn, setImageFn, setImageUrl, inputRef, imageRef]}>
      {props.children}
    </PatientContext.Provider>
  );
};