import React from 'react';
import { Card } from 'react-bootstrap';

function ErrorBox({error}){
    return (
    
    <Card className="text-center mt-5">
    <Card.Body>
      <Card.Title>Error</Card.Title>
      <Card.Text>
        {error}
      </Card.Text>
    </Card.Body>
   
  </Card>)
}

export default ErrorBox;