import mongoose, {mongo} from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    resetCode: {
        type: Number
    },
    hideLocation: {
        type: Boolean,
        default: false,
    },
    longitude: {
        type: Number,
        required: false,
    },
    latitude: {
        type: Number,
        required: false,
    },
    age: {
        type: Number,
        required: false,
    },
    weight: {
        type: Number,
        required: false,
    },
    length: {
        type: Number,
        required: false,
    },
    steps: {
        type: Number,
        required:false,
    },
    calories: {
        type: Number,
        required:false,
    },
    distance: {
        type: Number,
        required:false,
    },
    achievements: {
        type: Array,
        required: false,
    },
    posts:{
        type: Array,
        required: false,
    },
});

const User = mongoose.model('user', userSchema);

export default User;
