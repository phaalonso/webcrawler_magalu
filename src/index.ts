import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import {errors} from 'celebrate';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(helmet());

app.use(express.json());

app.use(routes);

app.use(errors());

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
