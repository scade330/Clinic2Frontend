import axios from "axios";

const API_BASE_URL = "/api/sales";      // backend API base URL
const PHARMACY_API_URL = "/api/pharmacy";

// =======================
// RECORD SALE
// =======================
export const recordNewSale = async (saleData) => {
  const res = await axios.post(`${API_BASE_URL}/record`, saleData);
  return res.data;
};

// =======================
// PHARMACY ITEMS
// =======================
export const fetchAllDrugs = async () => {
  const res = await axios.get(PHARMACY_API_URL);
  return res.data;
};

export const fetchDrugById = async (id) => {
  const res = await axios.get(`${PHARMACY_API_URL}/${id}`);
  return res.data;
};

// =======================
// DASHBOARD ENDPOINTS
// =======================
export const fetchTotalProfit = async () => {
  const res = await axios.get(`${API_BASE_URL}/total-profit`);
  return res.data;
};

export const fetchTopSelling = async () => {
  const res = await axios.get(`${API_BASE_URL}/top-selling`);
  return res.data;
};

export const fetchLowStock = async () => {
  const res = await axios.get(`${API_BASE_URL}/low-stock`);
  return res.data;
};

export const fetchMonthlyProfit = async () => {
  const res = await axios.get(`${API_BASE_URL}/monthly-profit`);
  return res.data;
};

// =======================
// SALES REPORTS
// =======================

// Last X days (generic)
export const fetchSalesLastDays = async (days) => {
  const res = await axios.get(`${API_BASE_URL}/last-days/${days}`);
  return res.data;
};

// Last 7 days
export const fetchSalesLast7Days = async () => {
  const res = await axios.get(`${API_BASE_URL}/last-7-days`);
  return res.data;
};

// Last 30 days
export const fetchSalesLast30Days = async () => {
  const res = await axios.get(`${API_BASE_URL}/last-30-days`);
  return res.data;
};

// Sales by month + year
export const fetchSalesByMonth = async (month, year) => {
  const res = await axios.get(`${API_BASE_URL}/month/${month}/${year}`);
  return res.data;
};

// Date range filter
export const fetchSalesDateRange = async (start, end) => {
  const res = await axios.post(`${API_BASE_URL}/range`, { start, end });
  return res.data;
};

// =======================
// PROFIT FILTERED ENDPOINTS
// =======================

// Profit for today
export const fetchProfitToday = async () => {
  const res = await axios.get(`${API_BASE_URL}/profit/today`);
  return res.data.totalProfit || 0;
};

// Profit for last 7 days
export const fetchProfitLast7Days = async () => {
  const res = await axios.get(`${API_BASE_URL}/profit/7days`);
  return res.data.totalProfit || 0;
};

// Profit for last 30 days
export const fetchProfitLast30Days = async () => {
  const res = await axios.get(`${API_BASE_URL}/profit/30days`);
  return res.data.totalProfit || 0;
};
