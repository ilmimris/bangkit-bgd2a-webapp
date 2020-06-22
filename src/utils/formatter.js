import React from "react";

export const formatResultCovid = num => {
    return (
        <>
            <li key="COVID-19-">
                {`COVID-19 (Negative): ${(num * 100).toFixed(2)}%`}
            </li>
            <li key="COVID-19+">
                {`COVID-19 (Positive): ${((1 - num) * 100).toFixed(2)}%`}
            </li>
            <br />
        </>
    )
}

export const formatResultPneumonia = num => {
    return (
        <>
            <li key="Pneumonia">
                {`Pneumonia: ${(num * 100).toFixed(2)}%`}
            </li>
            <li key="Normal">
                {`Normal: ${((1 - num) * 100).toFixed(2)}%`}
            </li>
            <br />
        </>
    )
}