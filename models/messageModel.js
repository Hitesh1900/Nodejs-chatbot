import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    question_type: {
        type: String,
        required: true,
        default: 'text', // 'text', 'voice', 'command'
    },
    command: { // question_type: command
        type: String,
        required: false,
    },
    question_text: { // question_type: text
        type: String,
        required: false,
    },
    question_voice_url: { // question_type: voice
        type: String,
        required: false,
    },
    question_voice_duration: { // question_type: voice
        type: Number,
        required: false,
    },
    answer_type: {
        type: String,
        required: true,
        default: 'text', // 'text' or 'voice'
    },
    answer_text: { // answer_type: text
        type: String,
        required: false,
    },
    answer_voice_url: { // answer_type: voice
        type: String,
        required: false,
    },
    answer_status: {
        type: Number,
        required: true,
        default: 0, // 0: pending, 1: answered, 2: rejected, 3: error, 4: limit_exceeded
    },
}, {
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);
export default Message;