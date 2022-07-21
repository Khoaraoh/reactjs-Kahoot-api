import mongoose from 'mongoose';

const { Schema } = mongoose;

const modelName = "user";
const userSchema = new Schema({
  email: String,
  password: String
});

export const userModel = mongoose.model(modelName, userSchema);