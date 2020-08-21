import alasql from 'alasql';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { LanguageServiceClient, protos } from '@google-cloud/language';
import { URLSearchParams } from 'url';

dotenv.config();

export default async function App(req) {

    let { urls, token } = req.body;
    let tokenResponse;

    try {
        tokenResponse = await validateToken(token);
    } catch(e){
        return {error:'Internal Error' + e};
    }

    if(tokenResponse){
        return await makeReport(urls) ;
    } else {
        return {error:'reCaptacha test has failed'};
    }
    
}


/* 
    functions
*/

async function request(url:string){

    if(url.indexOf("http") < 0 && url.indexOf("https://") < 0 ){
        url = "http://" + url;
    }

    let response;
    
    try {
    
        let f = await fetch(url,{timeout:5000});
        response = await f.text();

    } catch(e){

        console.error(e);
        return null;
    }

    return response;

}


async function validateToken(token:string){

    let response

    try {

        let params = new URLSearchParams();

        params.append('secret', '6Ld9GMAZAAAAACL28NL47sJ5A6gbSkTrr_x20JMf');
        params.append('response', token);

        let f = await fetch('https://www.google.com/recaptcha/api/siteverify', { 
            method: 'POST', 
            body: params 
        });

        response = await f.json();

    } catch(e){

        console.error(e);
        return null;

    }
 
    return response.success;

}

async function requestAnalyzeEntities(content:string) {

    const client = new LanguageServiceClient();  
    // The text to analyze
  
    const document:protos.google.cloud.language.v1.IDocument = {
      content: content,
      type: 'HTML',
      language:"EN"
    };
  
    // Detects entities in the document
    
    const [result] = await client.analyzeEntities({
        document, 
        encodingType:"UTF8"
    });

    return result.entities;

  }


async function fetchData(urls:string[]){
      
    let z = urls.map( async url=>{
        
        let HTMLresponse = await request(url);

            if (HTMLresponse) {

                let entityData = await requestAnalyzeEntities(HTMLresponse);

                let newData =  entityData.map((curValue:protos.google.cloud.language.v1.IEntity) => {
                    
                    return {
                        name:curValue.name,
                        salience:curValue.salience.toFixed(4),
                        webSite:url, 
                        type:curValue.type,
                        mentions:curValue.mentions.length
        
                    };
        
                })
        
                return {
                    label:url,
                    data:newData,
                    error:null
                }
                        
    
            } else {

                return {
                    label:url,
                    data:null,
                    error:'Unable to fetch data.'
                }
            }

    })
    
    return Promise.all(z);

  }

async function makeReport(urls:string[]){

    let fetchedData = await fetchData(urls);
    
    let qr = `SELECT *, MAX(salience) AS maxSalience  FROM ? GROUP BY LOWER(name)`;
    
    let returnData = fetchedData.map(({label, data, error})=>{
        return {
            label,
            error, 
            data: alasql(qr, [data])
        }
    });

    let set = returnData.filter(elem=>{
        return !elem.error;
    }).map(elem=>{
        return elem.data;
    })

    
    let [qr1,qr2] = [generateQuery(set), generateQuery(set,'RIGHT')];
    console.log(qr1, qr2);

    if(qr1==='' || qr1===''){
        return { error: 'Failed to fetch data from URLs' }
    } else {
       
    }

    let dataInnerJoin = alasql(qr1, set);
    let dataRightJoin = alasql(qr2, set);

   return {
       dataPerWebsite:returnData,
       dataInnerJoin:dataInnerJoin,
       dataRightJoin:dataRightJoin
   }

}

function generateQuery(set:any[], joinType='INNER'){

    let labels = ['A', 'B', 'C', 'D'];

    if(!set || set.length<2 || set.length>4)
        return ``;

    let reducer1 = (accumulator:string, value:any, index:number)=>{

        return accumulator = accumulator + 
            `\n\t${labels[index]}.website AS website${labels[index]},\n\t${labels[index]}.maxSalience AS maxSalience${labels[index]}`+ 
            (index !== set.length-1 ? `,` : `\n`);

    }

    let reducer2 = (accumulator:string, value:any, index:number)=>{

        if (index === 0){
            return accumulator;
        }

        if (index === 1){
            return accumulator = accumulator + 
                `\n\t? ${labels[index-1]}\n\t${joinType} JOIN ? ${labels[index]} ON LOWER(${labels[index-1]}.name) = LOWER(${labels[index]}.name)`
            
        }

        return accumulator = accumulator + 
            `\n\tINNER JOIN ? ${labels[index]} ON LOWER(${labels[index-1]}.name) = LOWER(${labels[index]}.name)`
        }

    let part1 = set.reduce(reducer1,`SELECT\n\tB.name,`);
    let part2 = set.reduce(reducer2,`\nFROM`);

    return part1+ part2 +  (joinType === 'RIGHT' ? `\tWHERE A.name IS NULL` : ``);
}