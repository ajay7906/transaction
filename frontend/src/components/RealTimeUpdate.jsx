import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function RealTimeUpdates() {
  const [transactions, setTransactions] = useState([]);
  const socket = io("http://localhost:5000"); // Replace with your backend WebSocket URL

  useEffect(() => {
    socket.on("transactionUpdate", (data) => {
      setTransactions((prev) => [data, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Real-Time Updates</h2>
      <ul className="bg-white rounded shadow p-4">
        {transactions.map((tx, idx) => (
          <li key={idx} className="mb-2">
            {tx.sender} sent {tx.amount} to {tx.receiver} ({tx.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
