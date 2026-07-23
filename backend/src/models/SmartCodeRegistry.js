import mongoose from 'mongoose';

const smartCodeRegistrySchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 4,
        match: /^[0-9]{4}$/
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'resourceType'
    },
    resourceType: {
        type: String,
        required: true,
        enum: ['Lesson', 'AlphabetLesson', 'VideoLesson']
    }
}, { timestamps: true });

// Create compound index for faster lookup and lookup validation
smartCodeRegistrySchema.index({ resourceId: 1, resourceType: 1 }, { unique: true });

const SmartCodeRegistry = mongoose.model('SmartCodeRegistry', smartCodeRegistrySchema);
export default SmartCodeRegistry;
