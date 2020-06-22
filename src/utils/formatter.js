import React from "react";
import { Typography, Progress } from 'antd';
const { Text } = Typography;

export const formatResultCovid = num => {
    return (
        <div style={{ width: '80%' }} >
            {/* <li key="COVID-19-">
                {`COVID-19 (Negative): ${(num * 100).toFixed(2)}%`}
            </li>
            <li key="COVID-19+">
                {`COVID-19 (Positive): ${((1 - num) * 100).toFixed(2)}%`}
            </li> */}
            <Text>SARS-Cov-2 infections probaility:</Text>
            <Progress
                percent={(Math.round((1 - num) * 100)).toFixed(2)}
                status="active"
                strokeColor="red"
            />
            <br />
        </div>
    )
}


export const formatResultBacteriaVirus = num => {
    return (
        <div style={{ width: '80%' }} >
            {/* <li key="Bacteria">
                {`Bacteria: ${(num * 100).toFixed(2)}%`}
            </li>
            <li key="Virus">
                {`Virus: ${((1 - num) * 100).toFixed(2)}%`}
            </li>
            <br /> */}
            <Text>Pneumonia/<Text mark>Bacteria</Text> probaility:</Text>
            <Progress
                status="active"
                strokeColor="orange"
                percent={(Math.round(num * 100)).toFixed(2)} />
            <br />
            <Text>Pneumonia/<Text mark>Virus</Text> probaility:</Text>
            <Progress
                status="active"
                strokeColor="red"
                percent={(Math.round((1 - num) * 100)).toFixed(2)} />
            <br />
        </div>
    )
}

export const formatResultPneumonia = num => {
    return (
        <div style={{ width: '80%' }} >
            {/* <li key="Pneumonia">
                {`Pneumonia: ${(num * 100).toFixed(2)}%`}
            </li>
            <li key="Normal">
                {`Normal: ${((1 - num) * 100).toFixed(2)}%`}
            </li>
            <br /> */}
            <Text>Pneumonia probaility:</Text>
            <Progress
                status="active"
                strokeColor="red"
                percent={(Math.round(num * 100)).toFixed(2)}
            />
            <br />
        </div>
    )
}