// src/components/SalesDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchTopSelling,
  fetchLowStock,
  fetchMonthlyProfit,
  fetchSalesLastDays,
  fetchSalesLast7Days,
  fetchSalesLast30Days,
  fetchProfitToday,
  fetchProfitLast7Days,
  fetchProfitLast30Days,
  deleteSale,
} from "@/lib/salesApi.js";

const DashboardCard = ({ title, value, color = "bg-indigo-500", onClick }) => (
  <div
    onClick={onClick}
    className={`${color} text-white rounded-xl shadow-lg p-6 flex flex-col justify-between 
    transition-transform duration-300 hover:scale-[1.02] cursor-pointer`}
  >
    <h3 className="text-lg font-semibold mb-4 opacity-90">{title}</h3>
    <p className="text-3xl md:text-4xl font-extrabold tracking-tight">{value}</p>
  </div>
);

const SalesDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalProfit: 0,
    topSelling: [],
    lowStock: [],
    monthlyProfit: [],
    sales: [],
    loading: true,
  });

  const [filter, setFilter] = useState("today");
  const [deleting, setDeleting] = useState(false);

  // Load filtered sales
  const loadFilteredData = async (filterType) => {
    try {
      let sales = [];
      let totalProfit = 0;

      if (filterType === "today") {
        sales = await fetchSalesLastDays(1);
        totalProfit = await fetchProfitToday();
      } else if (filterType === "last7") {
        sales = await fetchSalesLast7Days();
        totalProfit = await fetchProfitLast7Days();
      } else if (filterType === "last30") {
        sales = await fetchSalesLast30Days();
        totalProfit = await fetchProfitLast30Days();
      }

      return { sales, totalProfit };
    } catch (err) {
      console.error("Error loading filtered data:", err);
      return { sales: [], totalProfit: 0 };
    }
  };

  // Load dashboard data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [topSellingRes, lowStockRes, monthlyProfitRes, filteredData] =
          await Promise.all([
            fetchTopSelling(),
            fetchLowStock(),
            fetchMonthlyProfit(),
            loadFilteredData(filter),
          ]);

        setData({
          totalProfit: filteredData.totalProfit,
          topSelling: topSellingRes,
          lowStock: lowStockRes,
          monthlyProfit: monthlyProfitRes.map((m) => ({
            month: m._id?.month || "N/A",
            profit: m.totalProfit || 0,
          })),
          sales: filteredData.sales,
          loading: false,
        });
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    loadData();
  }, [filter]);

  // Delete sale
  const handleDelete = async (saleId) => {
    if (!window.confirm("Do you want to delete this sale?")) return;

    try {
      setDeleting(true);
      await deleteSale(saleId);

      const refreshed = await loadFilteredData(filter);

      setData((prev) => ({
        ...prev,
        sales: refreshed.sales,
        totalProfit: refreshed.totalProfit,
      }));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete sale.");
    } finally {
      setDeleting(false);
    }
  };

  if (data.loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-medium text-gray-700 bg-gray-50">
        Loading Sales Data... 🚀
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-10 bg-gray-50 min-h-screen space-y-10">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 border-b pb-4">
        Pharmacy Sales Dashboard 🚀
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: "Today", value: "today" },
          { label: "Last 7 Days", value: "last7" },
          { label: "Last 30 Days", value: "last30" },
        ].map((btn) => (
          <button
            key={btn.value}
            className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition ${
              filter === btn.value
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setFilter(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Profit"
          value={`$${data.totalProfit.toFixed(2)}`}
          color="bg-emerald-600 hover:bg-emerald-700"
        
        />
        <DashboardCard
          title="Top Selling Drug"
          value={data.topSelling[0]?._id || "N/A"}
          color="bg-sky-600 hover:bg-sky-700"
         
        />
        <DashboardCard
          title="Low Stock Items"
          value={data.lowStock.length}
          color="bg-rose-600 hover:bg-rose-700"
          onClick={() => navigate("/lowstockpage")}
        />
      </div>

      {/* Sales Table */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 overflow-x-auto">
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
          📝 Sales (
          {filter === "today"
            ? "Today"
            : filter === "last7"
            ? "Last 7 Days"
            : "Last 30 Days"}
          )
        </h3>

        <div className="min-w-full">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs md:text-sm">
              <tr>
                {["Item Name", "Quantity", "Profit", "Date", "Action"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-gray-600"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100 text-sm md:text-base">
              {data.sales.map((sale) => (
                <tr
                  key={sale._id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {sale.itemName}
                  </td>
                  <td className="px-4 py-3">{sale.quantitySold}</td>
                  <td className="px-4 py-3">${sale.profit.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(sale._id)}
                      disabled={deleting}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
