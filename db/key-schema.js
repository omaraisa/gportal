import mongoose from 'mongoose';


export const keySchema = mongoose.Schema({
    connectionString: {
      type: String,
      required: [true, 'must provide a key'],
    }
  })

  export default mongoose.model('key',  keySchema);