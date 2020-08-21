import React, { useState } from 'react';

import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import ResultsContainer from './containers/Results/ResultsContainer';
import Nav from './components/Navbar';
import InputForm from './components/InputForm';

function App() {

  const [viewResults, viewResultsUpdater] = useState({view:true});

  const handleForm = (data)=>{
    viewResultsUpdater(Object.assign({view:false}, {formData:{...data}}));
   
  }

  const resetFn = ()=>{
    viewResultsUpdater(Object.assign({}, {view:true}));
  }

  return (
    <div>
     
      <Container fluid>
        <Nav resetFn={resetFn}></Nav>
        <Row className="justify-content-md-center">
          <Col md="auto"> 
            { viewResults.view ? (<InputForm formSubmitHandler={handleForm}></InputForm>) : ( <ResultsContainer formData={viewResults.formData} ></ResultsContainer>) }
          </Col>
        </Row>
      </Container>
    </div>
   
  );

}

export default App;
