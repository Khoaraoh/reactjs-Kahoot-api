import mongoose from 'mongoose';

export const dbConnect = () => 
{
    return new Promise((resolve, reject) => {
        const url = process.env.MONGODB_URL;
    
        if (url) {
          mongoose
            .connect(url)
            .then(() => resolve('Connected to MongoDB'))
            .catch(() => reject('Cannot connect to MongoDB'));
        } else {
          reject('Cannot read database url from .env file');
        }
      });
}

export const checkConnect = () => mongoose.connections.readyState;