import mongoose, {mongo} from 'mongoose';

const achievementSchema = new mongoose.Schema({
    count:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    countType:{
        type: String,
        required: true,
    },
    isAchieved:{
        type: Boolean,
        default: false,
    },
});

const Achievement = mongoose.model('achievement', achievementSchema);

export default Achievement;
