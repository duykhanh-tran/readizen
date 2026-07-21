import SmartCodeRegistry from '../models/SmartCodeRegistry.js';

const BLACKLIST_CODES = [
    '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
    '1234', '4321', '0123', '3210', '5678', '8765', '6789', '9876'
];

export async function generateUniqueSmartCode() {
    let code;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 2000) {
        attempts++;
        const randomNum = Math.floor(Math.random() * 10000);
        code = String(randomNum).padStart(4, '0');

        if (BLACKLIST_CODES.includes(code)) continue;

        const exists = await SmartCodeRegistry.exists({ code });
        if (!exists) {
            isUnique = true;
        }
    }

    if (!isUnique) {
        throw new Error('Hệ thống quá tải, không thể tạo mã Smart Code duy nhất.');
    }
    return code;
}
