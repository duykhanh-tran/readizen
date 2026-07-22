import SmartCodeRegistry from '../models/SmartCodeRegistry.js';

export async function generateUniqueSmartCode() {
    const prefix = '9';
    
    // Find all existing registered codes starting with '9'
    const regex = new RegExp(`^${prefix}[0-9]{3}$`);
    const existingRegistries = await SmartCodeRegistry.find({ code: regex }).select('code');
    const existingCodes = new Set(existingRegistries.map(r => r.code));

    // Find available suffixes (000 to 999)
    const availableSuffixes = [];
    for (let i = 0; i <= 999; i++) {
        const candidateCode = prefix + String(i).padStart(3, '0');
        if (!existingCodes.has(candidateCode)) {
            availableSuffixes.push(candidateCode);
        }
    }

    if (availableSuffixes.length === 0) {
        throw new Error('Đã hết dải mã Smart Code khả dụng bắt đầu bằng số 9 (tối đa 1000 mã).');
    }

    // Pick a random code from available list
    const randomIndex = Math.floor(Math.random() * availableSuffixes.length);
    return availableSuffixes[randomIndex];
}
