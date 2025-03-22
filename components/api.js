import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";

const api = axios.create({
  baseURL: "http://192.168.1.119:8000/api",
});

api.interceptors.request.use(
  async (config) => {
    let token = await AsyncStorage.getItem("access_token");
    let expiry = await AsyncStorage.getItem("token_expiry");

    if (token && expiry && Date.now() > parseInt(expiry) * 1000) {
      console.log("Access token expired. Refreshing...");
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      try {
        axios
          .post("http://192.168.1.119:8000/api/token/refresh", {
            refresh_token: refreshToken,
          })
          .then((response) => {
            token = response.data.access;
            AsyncStorage.setItem("access_token", token);
            AsyncStorage.setItem(
              "token_expiry",
              (Date.now() + 300000).toString(),
            ); // Set new expiry time (adjust to your access token lifetime)
          });
      } catch (error) {
        //console.error("Refresh token failed. Logging out.");
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

export async function getProfile() {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);

    // If the request fails (e.g., 401 Unauthorized), navigate to login
    if (error.response && error.response.status === 401) {
      router.push("/login");
    }

    return null;
  }
}
