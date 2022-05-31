import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/routes.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const app = express();

const port = 5050;
const corsOptions = {
  origin: '*',
};

// Express setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('dev'));

// dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup public folder
app.use(express.static(path.join(__dirname, 'public')));

// set up routes
// routes(app);

app.get('/', (req, res) => {
  res.send('API is ready on ' + new Date());
});

app.listen(port, () => {
    console.log('Listening on port', port);
})

