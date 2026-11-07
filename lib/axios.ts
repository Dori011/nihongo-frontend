// lib/axios.ts
import axios from 'axios';

// Khởi tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', // Đã sửa thành 4000 Thay đổi port nếu backend của bạn chạy port khác
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bạn có thể thêm interceptor ở đây để tự động gắn Token (JWT) vào header nếu cần
axiosInstance.interceptors.request.use(
  (config) => {
    // Ví dụ: lấy token từ localStorage
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;