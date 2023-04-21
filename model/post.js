import mongoose, {mongo} from 'mongoose';

const postSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    count:{
        type: String,
        required: true,
    },
    countType:{
        type: String,
        required: true,
    }
});

const Post = mongoose.model('post', postSchema);

export default Post;