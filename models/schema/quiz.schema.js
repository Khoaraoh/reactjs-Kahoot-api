import mongoose from "mongoose";

const { Schema } = mongoose;

const modelName = "quiz";
const quizSchema = new Schema({
    questions: [
        {
            id: String,
            question: String,
            answers: [
                {
                    answer: String,
                },
            ],
            correctAnswer: String,
            imgPath: String,
        },
    ],
    name: String,
    userId: String,
    image: String,
});

export const quizModel = mongoose.model(modelName, quizSchema);
