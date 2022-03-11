import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectionString = process.env.connectionString;

export const connectDB = async(url) => {
    return mongoose.connect(connectionString, {
    })

}

import key from  './key-schema.js';
  
  export const getKey = async (keyId) =>{
    const requestedKey = await key.findOne({ _id: keyId })
    //const requestedKey = await key.find({})
    if (!requestedKey) {
      return {msg:'No keys found'}
    }
    return requestedKey
}
