import { useEffect, useState } from "react";
import { getLowStockPharmacies } from "../../lib/pharmacyApi";
import { AlertTriangle, PackageSearch } from "lucide-react";

export default function LowStockPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const data = await getLowStockPharmacies(); // uses Vite-aware API
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch low stock items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold">Low Stock Drugs</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <PackageSearch className="w-14 h-14 mx-auto text-green-600 mb-4" />
            <h2 className="text-xl font-semibold">All Good!</h2>
            <p className="text-gray-600 mt-2">No items are low on stock.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 font-semibold">Item</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Reorder Level</th>
                  <th className="p-4 font-semibold">Supplier</th>
                  <th className="p-4 font-semibold">Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {items.map((drug) => (
                  <tr key={drug._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{drug.itemName}</td>
                    <td className="p-4">{drug.category}</td>
                    <td className="p-4 text-red-600 font-bold">{drug.quantityInStock}</td>
                    <td className="p-4">{drug.reorderLevel}</td>
                    <td className="p-4">{drug.supplier}</td>
                    <td className="p-4">{new Date(drug.expiryDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
