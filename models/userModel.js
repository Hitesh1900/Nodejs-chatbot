import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
    },
    telegram_id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    limit_exceeded: {
        type: Boolean,
        required: true,
        default: false,
    },
    limited_until: {
        type: Date,
        required: false,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;