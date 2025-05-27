import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Request oldidan token qo‘shish
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Javobda access token muddati tugagan bo‘lsa, refresh qilish
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Agar 401 va oldin refresh qilinmagan bo‘lsa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");

      try {
        const res = await axios.post("http://localhost:8000/refresh", {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data.access_token;

        localStorage.setItem("access_token", newAccessToken);

        // Tokenni yangilab, requestni qaytadan yuboramiz
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh ham ishlamasa logout qilish mumkin
        console.error("Refresh failed", err);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
