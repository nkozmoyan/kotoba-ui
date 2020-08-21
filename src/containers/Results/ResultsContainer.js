import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';

import Report from '../../containers/Results/Report';
import ErrorBox from '../../components/Results/ErrorBox';

function ResultsContainer(props){

    const[data, updater] = useState([]);

    useEffect(()=>{

        const  API_URL = process.env.REACT_APP_API ? process.env.REACT_APP_API : '/';

        window.fetch(API_URL + '/report',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(props.formData)

        })
            .then(response=>response.json())
            .then(data=>updater(data))
            .catch(e=>{
                updater({error:'Sorry something went wrong. Please try again later.'})
            });
    },[props.formData])

    let chartData, labels = [];

    if (data.dataInnerJoin){

        chartData = data.dataInnerJoin.map(elem=>{

            let arr = [elem.name, Number(elem.maxSalienceA), Number(elem.maxSalienceB)];

            if(elem.maxSalienceC){
                arr.push(Number(elem.maxSalienceC));
            }

            if(elem.maxSalienceD){
                arr.push(Number(elem.maxSalienceD));
            }
            
            return arr;
        })

        labels = data.dataPerWebsite.map((elem, index)=>{
            return elem.label;
        })

        labels.unshift('Entity');
        chartData.unshift(labels);

    }

    if (data.error){
        return (<ErrorBox error={data.error}></ErrorBox>)
    } else {

        return (
        
            data.dataPerWebsite ? (
               
            <Report data={data} chartData={chartData}></Report>  
                        
        ) : (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>)
    
        )

    }

    
}

export default ResultsContainer;