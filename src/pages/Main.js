import React, { useContext } from "react";
import { Layout, Row, Col, Typography } from 'antd';

import { PneumoniaNormal, VirusCovidNoncovid, BacteriaVirus } from '../models';
import { PatientContext, StatemachineContext, stateMachine } from '../providers';

const { Header, Footer, Content } = Layout;
const { Title, Text } = Typography;

export default () => {
    const [
        imageUrl, imageFn,
        , ,
        , imageRef
    ] = useContext(PatientContext);
    const [appState,] = useContext(StatemachineContext);

    const { showImage = false } = stateMachine.states[appState];

    return (
        <div className="App">
            <Layout>
                <Header>
                    <Title style={{color: 'white', textAlign: 'center'}}>
                        Bangkit Final Project BDG2-A
                    </Title>
                </Header>
                <Content style={{margin: 'auto'}}>
                    <Row>
                        <Col span={24}>
                            <Title level={2} style={{textAlign:'center'}}>XR & CT COVID-19 Screening</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} offset={6} style={{margin: 'auto', textAlign: 'center'}}>
                        {showImage && (
                                <>
                                    <img src={imageUrl} alt="upload-preview" ref={imageRef} />
                                    <h4>filename: {imageFn}</h4>
                                </>
                            )}
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]} style={{ padding: 12 }}>
                        <Col span={8}> <PneumoniaNormal /> </Col>
                        <Col span={8}> <BacteriaVirus /> </Col>
                        <Col span={8}> <VirusCovidNoncovid /> </Col>
                    </Row>
                </Content>
                <Footer style={{textAlign: 'center'}}><Text >BDG2-A</Text></Footer>
            </Layout>
        </div>
    );
}