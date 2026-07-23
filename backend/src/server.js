import express from 'express';
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/authRoute.js';
import formRoutes from './routes/formRoute.js';
import chatRoutes from './routes/chatRoute.js';
import adminRoutes from './routes/adminRoute.js';
import lessonRoutes from './routes/lessonRoute.js';
import userRoutes from './routes/userRoute.js';
import alphabetRoutes from './routes/alphabetRoute.js';
import videoRoutes from './routes/videoRoute.js';
import podcastRoutes from './routes/podcastRoute.js';
import uploadRoutes from './routes/uploadRoute.js';
import bookmarkRoutes from './routes/bookmarkRoute.js';
import searchRoutes from './routes/searchRoute.js';
import Message from './models/Message.js';
import { setIO } from './utils/socketIO.js';
import { migrateSmartCodes } from './utils/smartCodeMigrator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình các domain được phép truy cập tài nguyên (đọc từ biến môi trường ALLOWED_ORIGIN)
const allowedOrigins = process.env.ALLOWED_ORIGIN
    ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:5173'];

const corsOptions = {
    origin: function (origin, callback) {
        // Cho phép các request không có header origin (ví dụ: công cụ kiểm thử hoặc mobile app)
        if (!origin) return callback(null, true);
        
        // Ghi log để chẩn đoán lỗi CORS trên Render
        console.log(`[CORS Check] Yêu cầu từ Origin: "${origin}"`);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error(`[CORS Blocked] Origin "${origin}" không nằm trong danh sách ALLOWED_ORIGIN:`, allowedOrigins);
            callback(new Error('Bị chặn bởi cấu hình bảo mật CORS'));
        }
    },
    credentials: true, // Bắt buộc phải có để truyền nhận HttpOnly Cookie cross-site
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/user', userRoutes);
app.use('/api/alphabet', alphabetRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/podcasts', podcastRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/search', searchRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Bị chặn bởi cấu hình bảo mật CORS (Socket.io)'));
            }
        },
        methods: ["GET", "POST"],
        credentials: true
    }
});

setIO(io);

// BƯỚC MỚI: Middleware bảo mật Socket.io bằng JWT
io.use((socket, next) => {
    // Lấy token do Frontend gửi lên trong lúc khởi tạo kết nối
    const token = socket.handshake.auth?.token;

    if (!token) {
        return next(new Error('Authentication error: Không tìm thấy Token!'));
    }

    try {
        // Giải mã token (Giống hệt cách làm trong authMiddleware của Express)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Lưu thông tin user (id, role) vào biến socket để dùng cho các sự kiện bên dưới
        socket.user = decoded;
        next(); // Token hợp lệ, cho phép kết nối
    } catch (err) {
        return next(new Error('Authentication error: Token không hợp lệ hoặc đã hết hạn!'));
    }
});

// Lắng nghe các kết nối từ Frontend (Chỉ những ai qua được cửa bảo vệ ở trên mới lọt vào đây)
io.on('connection', (socket) => {
    console.log(`🟢 User [${socket.user.role}] vừa kết nối: ${socket.id}`);

    socket.on('join_room', (userId) => {
        // Bảo mật thêm: Nếu là Client, chỉ được phép join đúng room của chính mình
        if (socket.user.role === 'client' && socket.user.id !== userId) {
            console.log(`⚠️ Cảnh báo: User ${socket.user.id} cố gắng join phòng của người khác!`);
            return;
        }

        socket.join(userId);
        console.log(`🚪 Socket ${socket.id} đã tham gia phòng: ${userId}`);
    });

    socket.on('send_message', async (data) => {
        const { userId, sender, text } = data;

        // Bảo mật thêm: Kiểm tra sender có khớp với role trong token không để chống giả mạo
        if (socket.user.role !== sender && !(socket.user.role === 'client' && sender === 'user')) {
            console.log(`⚠️ Cảnh báo: Phát hiện giả mạo danh tính người gửi!`);
            return;
        }

        // Tối ưu bảo mật (Vá lỗi BOLA/IDOR): Nếu là Client, chỉ được phép gửi tin nhắn vào phòng của chính mình
        if (socket.user.role === 'client' && socket.user.id !== userId) {
            console.log(`⚠️ Cảnh báo: Client ${socket.user.id} cố ý gửi tin nhắn vào phòng của người khác (${userId})!`);
            return;
        }

        try {
            const newMessage = new Message({ userId, sender, text });
            await newMessage.save();
            io.to(userId).emit('receive_message', newMessage);
        } catch (error) {
            console.error("❌ Lỗi khi lưu tin nhắn Socket:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`🔴 Người dùng đã ngắt kết nối: ${socket.id}`);
    });
});

// Fallback 404 Route handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Không tìm thấy đường dẫn được yêu cầu." });
});

// Centralized Error Handler (chống lộ Stack Trace)
app.use((err, req, res, next) => {
    console.error("❌ Uncaught Error:", err);
    const isProd = process.env.NODE_ENV === 'production';
    res.status(err.status || 500).json({
        message: err.message || "Lỗi máy chủ nội bộ.",
        ...(isProd ? {} : { error: err.stack })
    });
});

// CHÚ Ý: Chạy `server.listen` thay vì `app.listen`
if (process.env.NODE_ENV !== 'test') {
    connectDB().then(() => {
        server.listen(PORT, async () => {
            console.log(`🚀 Server (kèm Socket.io) đang chạy trên port ${PORT}`);
            await migrateSmartCodes();
        });
    });
}

export { app, server };