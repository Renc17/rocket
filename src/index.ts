import express, { Express } from 'express';
import * as bodyParser from 'body-parser';
import { router } from './routes';

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.json());

app.use('/api', router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
