import React from 'react';
import { Table } from 'react-bootstrap';

function ResultTable({label, data}){

    return (
        <div>
            <h2 className="my-3">Top 10 entities for {label}</h2>
            <Table striped bordered hover size="sm">
            <thead>
                <tr>
                <th width="80%">Name</th>
                <th>Salience</th>
                </tr>
            </thead>
            <tbody>
                {data.slice(0,10).map( result => {
                        return (
                            <tr key={result.name}>
                            <td>{result.name} </td>
                            <td>{result.maxSalience}</td>
                            </tr>
                        )
                }) }
            </tbody>  
            </Table>
        </div>
    )
}

export default ResultTable;