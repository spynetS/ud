import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://192.168.1.119:8000/api",
});

api.interceptors.request.use(
  async (config) => {
    let token = await AsyncStorage.getItem("access_token");
    let expiry = await AsyncStorage.getItem("token_expiry");

    if (token && expiry && Date.now() > parseInt(expiry)) {
      console.log("Access token expired. Refreshing...");

      const refreshToken = await AsyncStorage.getItem("refresh_token");
      try {
        const response = await axios.post(
          "http://192.168.1.119:8000/api/token/refresh/",
          {
            refresh: refreshToken,
          },
        );

        token = response.data.access;
        await AsyncStorage.setItem("access_token", token);
        await AsyncStorage.setItem(
          "token_expiry",
          (Date.now() + 300000).toString(),
        ); // Set new expiry time (adjust to your access token lifetime)
      } catch (error) {
        console.error("Refresh token failed. Logging out.");
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("refresh_token");
      }
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
