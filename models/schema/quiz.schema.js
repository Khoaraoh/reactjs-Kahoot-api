import mongoose, { Schema } from "mongoose";

const modelName = "quiz";
const quizSchema = new Schema({
    questions: [
        {
            id: String,
            question: String,
            answers: [
                {
                    answer: String
                }
            ],
            correctAnswer: String,
            image: String,
        }
    ],
    name: String,
    userId: String,
    image: String,
});

export const quizModel = mongoose.model(modelName, quizSchema)