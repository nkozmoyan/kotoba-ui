import React from 'react';
import { Chart } from "react-google-charts";


export default function MatchingChart(props) {

    let rowsCount = props.data.length;

    return (

      <Chart
            width={'100%'}
            height={ rowsCount*70 + 'px'}
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={props.data}
            options={{
              title: 'Comparison of common entities',
              chartArea: {'width': '60%', 'height': '80%'},
              legend:{'position': 'top'},
              hAxis: {
                title: 'Salience',
                minValue: 0,
              },
              vAxis: {
                title: 'Entity',
              },
            }}
            // For tests
            rootProps={{ 'data-testid': '1' }}
          />
        
    );
  
}
