import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import App from './app';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    if (req.body) {

        let body = await App(req);

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: body
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};

export default httpTrigger;
