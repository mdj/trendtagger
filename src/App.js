import React, {useEffect, useState} from 'react';
import './App.css';

// import ReactDOM from 'react-dom';
// import * as V from 'victory';

import BS from './BS.js';

import Alert from 'react-bootstrap/Alert';
// import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
// import Form from 'react-bootstrap/Form';
// import FormControl from 'react-bootstrap/FormControl';

import {csv, timeParse} from 'd3';

function Example() {
    return (
        <Alert dismissible variant="danger">
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <p>
                Change this and that and try again.
            </p>
        </Alert>
    )
}


function App() {
    const [data, setData] = useState([]);
    const [dimensions, setDimensions] = useState([]);
    useEffect(() => {
        csv('ABEV.csv').then(data => {
            // console.log(data);
            var parseDate = timeParse('%Y-%m-%dT%H:%M:%S%Z');
            // console.log(data[2].Date, parseDate(data[2].Date));

            data.forEach(function (d) {
                for (var key in d) {
                    if (!Number.isNaN(Number(d[key]))) {
                        d[key] = +d[key];
                    }
                    // console.log( key, d[key] );

                }
                d.Date = parseDate(d.Date);
            });
            // console.log(data[0])


            setData(data);
            setDimensions(["Volume","Adx14","Mdi14","Pdi14","Adx5","Mdi5","Pdi5","Adx2","Mdi2","Pdi2","PPO12_26","PPO12_26_Signal","Inv_PPO26_12","Inv_PPO26_12_Signal","FastSTOK5","FastSTOD3","FullSTOK3","FullSTOD3","CCI20","CCI15","CCI7","RSI14","RSI7","SMA7","SMA10","SMA20","SMA50","TRIX2","TRIX2_Signal","WILLR14","WILLR7","SAR"]);

        });
    }, []);
    return (
        <div className="App">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed={"top"}>
                <Navbar.Brand href="#home">TrendTagger</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#features">Projects</Nav.Link>
                        <Nav.Link href="#pricing">Datasets</Nav.Link>
                        <Nav.Link href="#pricing">Members</Nav.Link>
                        <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link href="#deets">More deets</Nav.Link>
                        <Nav.Link eventKey={2} href="#memes">
                            Dank memes
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Container fluid>
                <Row>
                    <Col className="d-none d-md-block bg-light sidebar" md={2}>
                        <div className="sidebar-sticky">
                            <Nav.Link href="#features">Features</Nav.Link>
                        </div>
                    </Col>
                    <Col role={"main"} md={9} sm={"auto"} lg={10}>
                        <div
                            className={"d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"}>
                            <h1 className="h2">Trend series</h1>
                        </div>

                        <BS data={data} dimensions={dimensions}/>

                    </Col>
                </Row>


            </Container>

        </div>
    );
}

export default App;


