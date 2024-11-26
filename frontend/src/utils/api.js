import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your backend URL
});

// Add Authorization Header
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = (data) => API.post("http://localhost:5000/api/auth/login", data);
export const signup = (data) => API.post("http://localhost:5000/api/auth/signup", data);
export const fetchTransactions = (params) => API.get("http://localhost:5000/api/transactions", { params });
export const fetchSummary = () => API.get("http://localhost:5000/api/summary");
export const createTransaction = (data) => API.post("/transactions/transfer", data);
