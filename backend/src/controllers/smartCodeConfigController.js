import SmartCodeConfig from '../models/SmartCodeConfig.js';
import SmartCodeRegistry from '../models/SmartCodeRegistry.js';
import Lesson from '../models/Lesson.js';
import AlphabetLesson from '../models/AlphabetLesson.js';
import VideoLesson from '../models/VideoLesson.js';
import mongoose from 'mongoose';

// Map resourceType to Mongoose Model
const MODEL_MAP = {
    'Lesson': Lesson,
    'AlphabetLesson': AlphabetLesson,
    'VideoLesson': VideoLesson
};

export const getSmartCodeConfig = async (req, res) => {
    try {
        const configs = await SmartCodeConfig.find({});
        res.status(200).json(configs);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tải cấu hình Smart Code.', error: error.message });
    }
};

export const updateSmartCodeConfig = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { configs } = req.body;

        if (!configs || !Array.isArray(configs) || configs.length !== 3) {
            return res.status(400).json({ message: 'Cấu hình không hợp lệ. Phải cung cấp đủ 3 phân mục.' });
        }

        // Validate resourceTypes and prefixes
        const validTypes = ['AlphabetLesson', 'Lesson', 'VideoLesson'];
        const prefixes = [];

        for (const item of configs) {
            if (!validTypes.includes(item.resourceType)) {
                return res.status(400).json({ message: `Loại tài nguyên không hợp lệ: ${item.resourceType}` });
            }
            if (!/^[0-9]$/.test(item.prefix)) {
                return res.status(400).json({ message: `Tiền tố phải là 1 chữ số (0-9): ${item.prefix}` });
            }
            prefixes.push(item.prefix);
        }

        // Check prefix uniqueness
        const uniquePrefixes = new Set(prefixes);
        if (uniquePrefixes.size !== prefixes.length) {
            return res.status(400).json({ message: 'Các tiền tố phải là duy nhất và không được trùng nhau.' });
        }

        // Load existing configs
        const currentConfigs = await SmartCodeConfig.find({});
        const currentMap = {};
        currentConfigs.forEach(c => {
            currentMap[c.resourceType] = c.prefix;
        });

        // Identify which resourceTypes have prefix changes
        const changedConfigs = [];
        for (const item of configs) {
            const oldPrefix = currentMap[item.resourceType];
            if (oldPrefix !== item.prefix) {
                changedConfigs.push({
                    resourceType: item.resourceType,
                    oldPrefix,
                    newPrefix: item.prefix
                });
            }
        }

        if (changedConfigs.length > 0) {
            // Find temporary digits to avoid transient collisions
            const allDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            const usedTempDigits = new Set(prefixes);
            const tempPrefixes = {};

            for (const change of changedConfigs) {
                const temp = allDigits.find(d => !usedTempDigits.has(d));
                if (!temp) {
                    throw new Error('Hệ thống không còn đủ chữ số trống để thực hiện di chuyển tạm thời.');
                }
                tempPrefixes[change.resourceType] = temp;
                usedTempDigits.add(temp);
            }

            // Step 1: Migrate changed categories to temporary prefixes
            for (const change of changedConfigs) {
                const Model = MODEL_MAP[change.resourceType];
                const tempPrefix = tempPrefixes[change.resourceType];

                // Get all documents for this resource type
                const docs = await Model.find({}).session(session);
                for (const doc of docs) {
                    if (doc.smartCode) {
                        const suffix = doc.smartCode.substring(1);
                        const tempCode = tempPrefix + suffix;

                        // Update in original collection
                        await Model.updateOne({ _id: doc._id }, { smartCode: tempCode }).session(session);

                        // Update in Registry
                        await SmartCodeRegistry.updateOne(
                            { resourceId: doc._id },
                            { code: tempCode },
                            { session }
                        );
                    }
                }
            }

            // Step 2: Migrate from temporary prefixes to final new prefixes
            for (const change of changedConfigs) {
                const Model = MODEL_MAP[change.resourceType];
                const tempPrefix = tempPrefixes[change.resourceType];
                const newPrefix = change.newPrefix;

                const docs = await Model.find({}).session(session);
                for (const doc of docs) {
                    if (doc.smartCode && doc.smartCode.startsWith(tempPrefix)) {
                        const suffix = doc.smartCode.substring(1);
                        const newCode = newPrefix + suffix;

                        // Update in original collection
                        await Model.updateOne({ _id: doc._id }, { smartCode: newCode }).session(session);

                        // Update in Registry
                        await SmartCodeRegistry.updateOne(
                            { resourceId: doc._id },
                            { code: newCode },
                            { session }
                        );
                    }
                }
            }
        }

        // Update database configuration mappings
        for (const item of configs) {
            await SmartCodeConfig.findOneAndUpdate(
                { resourceType: item.resourceType },
                { prefix: item.prefix },
                { upsert: true, session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Cấu hình Smart Code đã được cập nhật và đồng bộ dữ liệu thành công.' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Lỗi trong quá trình cập nhật cấu hình Smart Code.', error: error.message });
    }
};
