import { useState, useEffect } from "react";
import { fetchTransactions } from "../utils/api";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    status: "",
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const { data } = await fetchTransactions({
          ...filters,
          page,
        });
        setTransactions(data.transactions);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };
    getTransactions();
  }, [filters, page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Transactions</h2>
      <div className="mb-4 flex gap-4">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border rounded p-2"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border rounded p-2"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border rounded p-2"
        >
          <option value="">All Types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border rounded p-2"
        >
          <option value="">All Statuses</option>
          <option value="successful">Successful</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Transaction ID</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td className="border p-2">{tx.id}</td>
              <td className="border p-2">{tx.amount}</td>
              <td className="border p-2">{new Date(tx.date).toLocaleDateString()}</td>
              <td className="border p-2">{tx.type}</td>
              <td className="border p-2">{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
