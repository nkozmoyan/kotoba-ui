import React from 'react';
import ResultTable from '../../components/Results/ResultTable';
import MatchingChart from '../../components/Results/MatchingChart';
import { Table } from 'react-bootstrap';

function Report({data, chartData}){

    return(
        <div>
            <h1 className="mt-5">Comparison of websites for entity salience</h1>
            <MatchingChart data={chartData}></MatchingChart>
            
            <h2 className="my-3">Common entities</h2>
            <Table striped bordered hover size="sm">
            
            <thead>
                <tr>
                <th>Name</th>
                {data.dataPerWebsite.map(websiteData=>{
                    return ( <th key={websiteData.label}>{websiteData.label}</th>);
                })}
                </tr>
            </thead>
            <tbody>
                {data.dataInnerJoin.map( result => {
                        return (
                            <tr key={result.name}>
                                <td>{result.name} </td>
                                <td>{result.maxSalienceA}</td>
                                <td>{result.maxSalienceB}</td>
                                {result.maxSalienceC ? <td>{result.maxSalienceC}</td> : null}
                                {result.maxSalienceD ? <td>{result.maxSalienceD}</td> : null}
                            </tr>
                        )
                }) }
            </tbody>  
            </Table>

            <h2 className="my-3">Missing entities</h2>
            <Table striped bordered hover size="sm">
            <thead>
                <tr>
                <th>Name</th>
                {data.dataPerWebsite.map(websiteData=>{
                    return ( <th key={websiteData.label} >{websiteData.label}</th>);
                })}
                </tr>
            </thead>
            <tbody>
                {data.dataRightJoin.map( result => {
                        return (
                            <tr key={result.name}>
                                <td>{result.name} </td>
                                <td>{result.maxSalienceA}</td>
                                <td>{result.maxSalienceB}</td>
                                {result.maxSalienceC ? <td>{result.maxSalienceC}</td> : null}
                                {result.maxSalienceD ? <td>{result.maxSalienceD}</td> : null}
                            </tr>
                        )
                }) }
            </tbody>  
            </Table>

            {data.dataPerWebsite.map(websiteData=>{
                return ( <ResultTable key={`table`+ websiteData.label} label={websiteData.label} data={websiteData.data}></ResultTable>)
            })}

        </div>
    )
}

export default Report;