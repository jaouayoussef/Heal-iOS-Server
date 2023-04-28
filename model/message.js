import mongoose, {Schema} from 'mongoose';

const messageSchema = new mongoose.Schema({
    from: {
        type: String, required: true,
    }, to: {
        type: String,
    }, message: {
        type: String, required: true,
    },

}, {timestamps: true});

const Message = mongoose.model('message', messageSchema);

export default Message;