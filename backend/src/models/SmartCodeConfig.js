import mongoose from 'mongoose';

const smartCodeConfigSchema = new mongoose.Schema({
    resourceType: {
        type: String,
        required: true,
        unique: true,
        enum: ['AlphabetLesson', 'Lesson', 'VideoLesson']
    },
    prefix: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]$/
    }
}, { timestamps: true });

const SmartCodeConfig = mongoose.model('SmartCodeConfig', smartCodeConfigSchema);
export default SmartCodeConfig;
