import TransactionsTable from "./TransactionsTable";
import TransactionSummary from "./TransactionSummary";
import RealTimeUpdates from "./RealTimeUpdates";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Financial Dashboard</h1>
      <TransactionSummary />
      <TransactionsTable />
      <RealTimeUpdates />
    </div>
  );
}
