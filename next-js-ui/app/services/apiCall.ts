import axios from "axios";
import { getSession } from "next-auth/react";

const apiCall = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiCall.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const token = session?.user?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("İstek gönderilirken hata oluştu:", error);
    return Promise.reject(error);
  }
);

apiCall.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn("Yetkisiz erişim - Giriş yapmanız gerekebilir.");
      } else if (status === 403) {
        console.warn("Bu işlemi yapmaya yetkiniz yok.");
      } else if (status >= 500) {
        console.error("Sunucu hatası:", error.response.data);
      } else {
        console.warn(
          "Bir hata oluştu:",
          error.response.data?.message || error.message
        );
      }
    } else if (error.request) {
      console.error("Sunucudan yanıt alınamadı.");
    } else {
      console.error("İstek oluşturulurken bir hata oluştu:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiCall;
