import React from 'react';
import { Navbar } from 'react-bootstrap';
import logo from '../assets/logo.png';


function Nav({resetFn}){

    return (
        <Navbar bg="light" variant="dark">
          <Navbar.Brand onClick={resetFn} className="navbar">
            <img
              alt=""
              src={logo}
              width="100"
              height="100"
              className="d-inline-block align-top"
            />{' '}
          </Navbar.Brand>
        </Navbar>
      )
}

export default Nav;