import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

import userRouter from './route/user.js';

const app = express();
const port = process.env.PORT || 1337;
const databaseName = "HealDB";
const dbURIOffline = `mongodb://0.0.0.0:27017/${databaseName}`;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));
app.use('/img', express.static('public/images'));

mongoose.set("debug", true);
mongoose.Promise = global.Promise;

mongoose.connect(dbURIOffline, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Connected to ${databaseName}`);
}).catch((err) => {
    console.log(err.message);
});

app.get('/', (req, res) => {
    res.send({message: 'Default route'});
});

app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

