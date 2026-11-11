import serverless from "serverless-http";
import app from "../../server/app.js";

const netlifyApp = (request, response) => app.handle(request, response);

export const handler = serverless(netlifyApp);
