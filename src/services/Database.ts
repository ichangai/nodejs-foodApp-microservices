import { MONGO_URI } from '../config';
import mongoose, { ConnectOptions } from 'mongoose';

export default async () => {

    try {
    // Connect to mongoDB
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions).then(result => {
        console.log('Connected to MongoDB');
    }).catch(err => {
        console.log(err);
    })

    } catch (err) {
        console.log(err);
    }



}



