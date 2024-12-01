// import { useEffect, useState } from "react";
// import { fetchSummary } from "../utils/api";

// export default function TransactionSummary() {
//   const [summary, setSummary] = useState({
//     totalVolume: 0,
//     totalTransactions: 0,
//     avgTransactionSize: 0,
//     statusBreakdown: {
//       successful: 0,
//       pending: 0,
//       failed: 0,
//     },
//   });

//   useEffect(() => {
//     const getSummary = async () => {
//       try {
//         const { data } = await fetchSummary();
//         setSummary(data);
//       } catch (err) {
//         console.error("Failed to fetch summary", err);
//       }
//     };
//     getSummary();
//   }, []);

//   return (
//     <div className="bg-white p-6 rounded shadow">
//       <h2 className="text-xl font-bold mb-4">Transaction Summary</h2>
//       <div className="grid grid-cols-2 gap-4">
//         <div className="p-4 bg-blue-100 rounded">
//           <h3 className="text-lg font-semibold">Total Volume</h3>
//           <p className="text-2xl font-bold">{summary.totalVolume}</p>
//         </div>
//         <div className="p-4 bg-green-100 rounded">
//           <h3 className="text-lg font-semibold">Total Transactions</h3>
//           <p className="text-2xl font-bold">{summary.totalTransactions}</p>
//         </div>
//         <div className="p-4 bg-yellow-100 rounded">
//           <h3 className="text-lg font-semibold">Average Transaction Size</h3>
//           <p className="text-2xl font-bold">{summary.avgTransactionSize}</p>
//         </div>
//         <div className="p-4 bg-red-100 rounded">
//           <h3 className="text-lg font-semibold">Status Breakdown</h3>
//           <p className="text-base">
//             Successful: {summary.statusBreakdown.successful}
//           </p>
//           <p className="text-base">
//             Pending: {summary.statusBreakdown.pending}
//           </p>
//           <p className="text-base">
//             Failed: {summary.statusBreakdown.failed}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import axios from "axios";

export default function TransactionSummary() {
  const [summary, setSummary] = useState({
    totalVolume: 0,
    totalTransactions: 0,
    avgTransactionSize: 0,
    statusBreakdown: {
      successful: 0,
      pending: 0,
      failed: 0,
    },
  });

  useEffect(() => {
    const getSummary = async () => {
      try {
        const token = localStorage.getItem("token"); // Fetch token from local storage
        if (!token) {
          console.error("No token found. Please log in again.");
          return;
        }

        // Direct API call
        const response = await axios.get("http://localhost:5000/api/transactions/transaction", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Setting the fetched summary data
        setSummary(response.data);
      } catch (err) {
        console.error("Failed to fetch transaction summary", err);
      }
    };

    getSummary();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Transaction Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-100 rounded">
          <h3 className="text-lg font-semibold">Total Volume</h3>
          <p className="text-2xl font-bold">{summary.totalVolume}</p>
        </div>
        <div className="p-4 bg-green-100 rounded">
          <h3 className="text-lg font-semibold">Total Transactions</h3>
          <p className="text-2xl font-bold">{summary.totalTransactions}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded">
          <h3 className="text-lg font-semibold">Average Transaction Size</h3>
          <p className="text-2xl font-bold">{summary.avgTransactionSize}</p>
        </div>
        <div className="p-4 bg-red-100 rounded">
          <h3 className="text-lg font-semibold">Status Breakdown</h3>
          <p className="text-base">Successful: {summary.statusBreakdown.successful}</p>
          <p className="text-base">Pending: {summary.statusBreakdown.pending}</p>
          <p className="text-base">Failed: {summary.statusBreakdown.failed}</p>
        </div>
      </div>
    </div>
  );
}
