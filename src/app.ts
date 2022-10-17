import { PORT } from './config/index';
import express from 'express';
import App  from './services/ExpressApp';
import dbConnection from './services/Database';


const startServer = async () => {

    const app = express();

    await App(app);

    await dbConnection();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}


startServer();