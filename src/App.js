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

// function Example() {
//     return (
//         <Alert dismissible variant="danger">
//             <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
//             <p>
//                 Change this and that and try again.
//             </p>
//         </Alert>
//     )
// }


  function toISOString(date) {
      var tzo = -date.getTimezoneOffset(),
          dif = tzo >= 0 ? '+' : '-',
          pad = function(num) {
              var norm = Math.floor(Math.abs(num));
              return (norm < 10 ? '0' : '') + norm;
          };
      return date.getFullYear() +
          '-' + pad(date.getMonth() + 1) +
          '-' + pad(date.getDate()) +
          'T' + pad(date.getHours()) +
          ':' + pad(date.getMinutes()) +
          ':' + pad(date.getSeconds()) +
          dif + pad(tzo / 60) + pad(tzo % 60);
  }

function downloadData(data, filename) {

    // console.log(csvContent);


    var keys = Object.keys(data[0]);
    console.log(keys);
    console.log(data[0]);

    var csvContent = keys.join(",") + "\n";

    keys = keys.filter(e => e !== 'Date');
    keys = keys.filter(e => e !== 'Name');
    keys = keys.filter(e => e !== 'Labeled');
    console.log(keys);

    data.forEach(function (d) {
                // Fixed prefixed values
                var row = [d.Name, toISOString(d.Date)].join(",");

                keys.forEach(function (key) {
                    row += "," + d[key];
                });
                row += "," + ((typeof d.Labeled === 'undefined') ? "0" : d.Labeled);
                csvContent += row + "\n";
            });

    console.log(csvContent);

    var saveData = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, fileName) {
            var string = csvContent,
                blob = new Blob([string], {type: 'text/csv, charset=UTF-8'}),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());

    if (!filename.endsWith('-labeled')) {
      filename += '-labeled';
    }
    saveData(csvContent, filename + '.csv');
    // $('#exportComplete').show();
    // $('.navbar').css("opacity", "0.5");
    // $('#maindiv').css("opacity", "0.5");
}

function App() {
    const [data, setData] = useState([]);
    const [dimensions, setDimensions] = useState([]);
    const [selectedClass, setClass] = useState(1);
    const [filename, setFilename] = useState("ABEV.csv");

    useEffect(() => {


        csv(filename).then(data => {
            // console.log(data[0]);
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
            setDimensions(["Close","Volume","Adx14","Mdi14","Pdi14"]/*,"Adx5","Mdi5","Pdi5","Adx2","Mdi2","Pdi2","PPO12_26","PPO12_26_Signal","Inv_PPO26_12","Inv_PPO26_12_Signal","FastSTOK5","FastSTOD3","FullSTOK3","FullSTOD3","CCI20","CCI15","CCI7","RSI14","RSI7","SMA7","SMA10","SMA20","SMA50","TRIX2","TRIX2_Signal","WILLR14","WILLR7","SAR"]*/);

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
                        <button onClick={() => downloadData(data, filename)}>Download data</button>

                        <BS data={data} dimensions={dimensions} primary={"Close"} selectedClass={selectedClass}/>
                        <div>
                            <button onClick={() => setClass(0)}>No label</button>
                            <button onClick={() => setClass(1)}>Class 1</button>
                            <button onClick={() => setClass(2)}>Class 2</button>

                        </div>
                    </Col>
                </Row>


            </Container>

        </div>
    );
}

export default App;


