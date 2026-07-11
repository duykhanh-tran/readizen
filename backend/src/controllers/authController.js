import User from '../models/User.js';
import Admin from '../models/Admin.js';
import Session from '../models/Session.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Hàm tạo token
const generateTokens = (id, role) => {
    // Access token hết hạn nhanh (ví dụ: 15 phút)
    const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    // Refresh token hết hạn lâu (ví dụ: 7 ngày)
    const refreshToken = jwt.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

// Cấu hình cookie động tùy theo môi trường dev/prod
const getCookieOptions = () => {
    const isProd = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProd, // Chỉ secure trên production (yêu cầu HTTPS)
        sameSite: 'lax', // Khác origin nhưng cùng site readizen.vn nên dùng lax
    };
};

export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email này đã được sử dụng!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        const { accessToken, refreshToken } = generateTokens(user._id, 'client');

        // Lưu session vào database
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt
        });

        // Đặt cookie cho refresh token (sameSite: 'lax' trên production, 'none' ở dev)
        res.cookie('refreshToken', refreshToken, {
            ...getCookieOptions(),
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Đăng nhập thành công',
            accessToken,
            user: { id: user._id, fullName: user.fullName, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(400).json({ message: 'Tài khoản quản trị không tồn tại.' });

        const isMatch = await bcrypt.compare(password, admin.hashedPassword);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu quản trị.' });

        const { accessToken, refreshToken } = generateTokens(admin._id, 'admin');

        // Lưu session (Admin cũng lưu vào bảng Session)
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await Session.create({
            userId: admin._id,
            refreshToken,
            expiresAt
        });

        res.cookie('refreshToken', refreshToken, {
            ...getCookieOptions(),
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: 'Admin đăng nhập thành công', accessToken });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        let user;
        if (req.user.role === 'admin') {
            user = await Admin.findById(req.user.id).select('-hashedPassword');
        } else {
            user = await User.findById(req.user.id).select('-hashedPassword');
        }

        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;
        if (token) {
            await Session.deleteOne({ refreshToken: token });
            res.clearCookie("refreshToken", getCookieOptions());
        }
        res.status(200).json({ message: 'Đăng xuất thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// API cấp lại Access Token mới và xoay vòng Refresh Token (RTR)
export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'Truy cập bị từ chối. Không tìm thấy Refresh Token.' });
        }

        const session = await Session.findOne({ refreshToken: token });
        if (!session) {
            // Nếu token có trong cookie nhưng không có trong DB -> có thể đã bị xóa hoặc hết hạn
            res.clearCookie("refreshToken", getCookieOptions());
            return res.status(403).json({ message: 'Refresh Token không hợp lệ hoặc đã hết hạn.' });
        }

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                // Token không hợp lệ về mặt chữ ký hoặc hết hạn -> xóa khỏi DB
                await Session.deleteOne({ refreshToken: token });
                res.clearCookie("refreshToken", getCookieOptions());
                return res.status(403).json({ message: 'Refresh Token đã hết hạn, vui lòng đăng nhập lại.' });
            }

            // Tạo cặp token mới (Xoay vòng Refresh Token Rotation)
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id, decoded.role);

            // Cập nhật lại session trong DB với token mới
            session.refreshToken = newRefreshToken;
            session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày mới
            await session.save();

            // Cập nhật Cookie
            res.cookie('refreshToken', newRefreshToken, {
                ...getCookieOptions(),
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Cập nhật mật khẩu mới
export const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu cũ và mật khẩu mới.' });
        }

        let user;
        if (req.user.role === 'admin') {
            user = await Admin.findById(userId);
        } else {
            user = await User.findById(userId);
        }

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.hashedPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu cũ không chính xác.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.hashedPassword = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Cập nhật mật khẩu thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Cập nhật URL ảnh đại diện
export const updateAvatar = async (req, res) => {
    try {
        const { avatarUrl } = req.body;
        const userId = req.user.id;

        if (!avatarUrl) {
            return res.status(400).json({ message: 'Vui lòng cung cấp URL ảnh đại diện.' });
        }

        let user;
        if (req.user.role === 'admin') {
            // Admin không lưu avatarUrl nên ta bỏ qua hoặc cập nhật động nếu Schema cho phép, ở đây ta lưu vào user
            return res.status(400).json({ message: 'Tính năng này không dành cho quản trị viên.' });
        } else {
            user = await User.findByIdAndUpdate(userId, { avatarUrl }, { new: true }).select('-hashedPassword');
        }

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
        }

        res.status(200).json({ message: 'Cập nhật ảnh đại diện thành công!', user });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Lấy thông tin phiên học tập hiện tại (Guest-friendly, trả 200 thay vì 401 khi chưa đăng nhập)
export const getSession = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(200).json({ authenticated: false, user: null });
        }

        const session = await Session.findOne({ refreshToken: token });
        if (!session) {
            res.clearCookie("refreshToken", getCookieOptions());
            return res.status(200).json({ authenticated: false, user: null });
        }

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                await Session.deleteOne({ refreshToken: token });
                res.clearCookie("refreshToken", getCookieOptions());
                return res.status(200).json({ authenticated: false, user: null });
            }

            // Tạo cặp token mới (Xoay vòng Refresh Token Rotation - RTR)
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id, decoded.role);

            // Cập nhật lại session trong DB với token mới
            session.refreshToken = newRefreshToken;
            session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày mới
            await session.save();

            // Cập nhật Cookie
            res.cookie('refreshToken', newRefreshToken, {
                ...getCookieOptions(),
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            // Lấy thông tin user
            let user;
            if (decoded.role === 'admin') {
                user = await Admin.findById(decoded.id).select('-hashedPassword');
            } else {
                user = await User.findById(decoded.id).select('-hashedPassword');
            }

            if (!user) {
                return res.status(200).json({ authenticated: false, user: null });
            }

            res.status(200).json({
                authenticated: true,
                accessToken: newAccessToken,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: decoded.role,
                    avatarUrl: user.avatarUrl
                }
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};