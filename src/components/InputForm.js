import React, { useState, useRef, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import isUrl  from 'is-url-superb';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
  
function InputForm({formSubmitHandler}){

    const [websiteA, updaterWebsiteA] = useState('');
    const [websiteB, updaterWebsiteB] = useState('');
    const [websiteC, updaterWebsiteC] = useState('');
    const [websiteD, updaterWebsiteD] = useState('');
    const [submitButton, updaterSubmitButton] = useState(true);

    const { executeRecaptcha } = useGoogleReCaptcha();
    const o = useRef({error:null, token:null, urls:[]});
    
    useEffect(()=>{
        executeRecaptcha("main_page").then(token=>{
            o.current.token = token;
        }).catch(error=>{
            o.current.error = error;
        })
    },[executeRecaptcha])

    useEffect(()=>{

        let websites = [
            websiteA,
            websiteB,
            websiteC,
            websiteD
        ];

        let urls = websites.filter(website=>{
            return isUrl(website) || isUrl(`http://`+ website);
        })

        if(urls.length < 2){
            o.current.error = 'Please provide at least 2 URLs to compare';
            updaterSubmitButton(true);
        } else {
            o.current.error = null;
            o.current.urls = urls;
         
            updaterSubmitButton(false);
            
        }


    },[ websiteA,
        websiteB,
        websiteC,
        websiteD]);

   

    const formSubmit = (e)=>{

        e.preventDefault();
        
        formSubmitHandler(o.current); 

    }

    const updateWebsiteA = (e)=>{
        updaterWebsiteA(e.target.value);
    }

    const updateWebsiteB = (e)=>{
        updaterWebsiteB(e.target.value);
    }

    const updateWebsiteC = (e)=>{
        updaterWebsiteC(e.target.value);
    }

    const updateWebsiteD = (e)=>{
        updaterWebsiteD(e.target.value);
    }

    return (
           
            <Form className="mb-3" onSubmit={formSubmit}>

            {
                //<Alert variant="danger">Please provide at least two valid URLs to compare.</Alert>
            }
            
            <h2 className="my-3">
                Analyze your content with Natural Language Processing (NLP)
            </h2>
            <Form.Group controlId="your-webpage" >
                <Form.Label>Your Website/URL</Form.Label>
                <Form.Control type="text" value={websiteA} onChange={updateWebsiteA} placeholder="" />
            </Form.Group>

            <Form.Group controlId="competitor-1-webpage">
                <Form.Label>Competitor 1 Website/URL</Form.Label>
                <Form.Control type="text" value={websiteB} onChange={updateWebsiteB}  placeholder="" />
            </Form.Group>

            <Form.Group controlId="competitor-2-webpage">
                <Form.Label>Competitor 2 Website/URL</Form.Label>
                <Form.Control type="text" value={websiteC} onChange={updateWebsiteC}  placeholder="" />
            </Form.Group>

            <Form.Group controlId="competitor-3-webpage">
                <Form.Label>Competitor 3 Website/URL</Form.Label>
                <Form.Control type="text" value={websiteD} onChange={updateWebsiteD}  placeholder="" />
            </Form.Group>

            <Button disabled={submitButton}  variant="primary" type="submit">
                Compare Pages
            </Button>

            </Form>
    )
}

export default InputForm;