import axios from "axios";

const API_BASE_URL = "/api/sales";
const PHARMACY_API_URL = "/api/pharmacy";

// =======================
// RECORD SALE
// =======================
export const recordNewSale = async (saleData) => {
  const res = await axios.post(`${API_BASE_URL}/record`, saleData, { withCredentials: true });
  return res.data;
};

// =======================
// PHARMACY ITEMS
// =======================
export const fetchAllDrugs = async () => {
  try {
    const res = await axios.get(PHARMACY_API_URL, { withCredentials: true });
    // If backend wraps data inside { success, data }
    return Array.isArray(res.data) ? res.data : Array.isArray(res.data.data) ? res.data.data : [];
  } catch (err) {
    console.error("Error fetching drugs:", err);
    return [];
  }
};


export const fetchDrugById = async (id) => {
  const res = await axios.get(`${PHARMACY_API_URL}/${id}`, { withCredentials: true });
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
export const fetchSalesLastDays = async (days) => {
  const res = await axios.get(`${API_BASE_URL}/last-days/${days}`);
  return res.data;
};

export const fetchSalesLast7Days = async () => {
  const res = await axios.get(`${API_BASE_URL}/last-7-days`);
  return res.data;
};

export const fetchSalesLast30Days = async () => {
  const res = await axios.get(`${API_BASE_URL}/last-30-days`);
  return res.data;
};

export const fetchSalesByMonth = async (month, year) => {
  const res = await axios.get(`${API_BASE_URL}/month/${month}/${year}`);
  return res.data;
};

export const fetchSalesDateRange = async (start, end) => {
  const res = await axios.post(`${API_BASE_URL}/range`, { start, end });
  return res.data;
};

// =======================
// PROFIT FILTERED ENDPOINTS
// =======================
export const fetchProfitToday = async () => {
  const res = await axios.get(`${API_BASE_URL}/profit/today`);
  return res.data?.totalProfit || 0;
};

export const fetchProfitLast7Days = async () => {
  const res = await axios.get(`${API_BASE_URL}/profit/7days`);
  return res.data?.totalProfit || 0;
};

export const fetchProfitLast30Days = async () => {
  const res = await axios.get(`${API_BASE_URL}/profit/30days`);
  return res.data?.totalProfit || 0;
};
