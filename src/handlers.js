import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import settings from "../config/settings.js";

export default {
    getUser: async (userTelegramId) => {
        return await User.findOne({ telegram_id: userTelegramId });
    },
    createUser: async (createObj) => {
        return await User.create(createObj);
    },
    updateUser: async (userId, updateObj) => {
        await User.updateOne({ _id: userId }, updateObj);
    },
    createMessage: async (createObj) => {
        return await Message.create(createObj);
    },
    updateMessage: async (messageId, updateObj) => {
        await Message.updateOne({ _id: messageId }, updateObj);
    },
    isLimitExceeded: async (userId) => {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const voiceMessagesLength = await Message.aggregate([{
            $match: {
                user: userId,
                // answer_status: { $ne: 4 },
                answer_status: 1,
                createdAt: { $gte: todayStart, $lt: todayEnd },
            },
        }, {
            $group: {
                _id: null,
                total: { $sum: '$question_voice_duration' },
            },
        }]);
        const voiceMessagesLengthSum = voiceMessagesLength.length > 0 ?
            voiceMessagesLength[0].total : 0;

        const messagesCount = await Message.countDocuments({
            user: userId,
            answer_status: 1,
            createdAt: { $gte: todayStart, $lt: todayEnd },
        });

        return messagesCount >= settings.max_questions_per_day ||
            voiceMessagesLengthSum >= settings.max_voice_messages_length_per_day;
    },
};