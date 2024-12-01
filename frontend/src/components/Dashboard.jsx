





// import { useState } from "react";
// import TransactionsTable from "./TransactionTable";
// import TransactionSummary from "./TransactionSummary";
// import RealTimeUpdates from "./RealTimeUpdate";
// import axios from "axios";

// export default function Dashboard() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     sender: "",
//     receiver: "",
//     amount: "",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSendMoney = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       const response = await axios.post("http://localhost:5000/api/transfer", formData, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure user authentication
//         },
//       });

//       if (response.status === 201) {
//         setSuccess("Transaction successful!");
//         setFormData({ sender: "", receiver: "", amount: "" });
//         setTimeout(() => setIsModalOpen(false), 2000); // Close the modal after success
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || "An error occurred.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">Financial Dashboard</h1>
//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
//       >
//         Send Money
//       </button>

//       <TransactionSummary />
//       <TransactionsTable />
//       <RealTimeUpdates />

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h2 className="text-xl font-bold mb-4">Send Money</h2>
//             {error && <p className="text-red-500 mb-3">{error}</p>}
//             {success && <p className="text-green-500 mb-3">{success}</p>}
//             <form onSubmit={handleSendMoney} className="space-y-4">
//               <div>
//                 <label htmlFor="sender" className="block text-sm font-medium">
//                   Sender
//                 </label>
//                 <input
//                   type="text"
//                   id="sender"
//                   name="sender"
//                   value={formData.sender}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full mt-1 p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="receiver" className="block text-sm font-medium">
//                   Receiver
//                 </label>
//                 <input
//                   type="text"
//                   id="receiver"
//                   name="receiver"
//                   value={formData.receiver}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full mt-1 p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="amount" className="block text-sm font-medium">
//                   Amount (USD)
//                 </label>
//                 <input
//                   type="number"
//                   id="amount"
//                   name="amount"
//                   value={formData.amount}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full mt-1 p-2 border rounded"
//                 />
//               </div>
//               <div className="flex justify-end space-x-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                   Send
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }























import { useState, useEffect } from "react";
import TransactionsTable from "./TransactionTable";
import TransactionSummary from "./TransactionSummary";
import RealTimeUpdates from "./RealTimeUpdate";
import axios from "axios";

export default function Dashboard() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userIds, setUserIds] = useState(null);



  function getUserIdFromToken(token) {
    try {
      // Split the token into its parts (header, payload, signature)
      const payload = token.split(".")[1];
      // Decode the payload from base64
      const decodedPayload = atob(payload);
      // Parse the JSON string into an object
      const payloadObj = JSON.parse(decodedPayload);
      // Return the user ID
      return payloadObj.id; // Assuming the user ID is stored as "id" in the payload
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }
  
  // Example usage
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      const userId = getUserIdFromToken(token);
      setUserIds(userId);
    }
  }, []); 
  

  // Fetch all users when the first popup opens
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data); // Assuming the response contains a list of users
    } catch (err) {
      setError("Failed to fetch users.");
    }
  };



  console.log(users);
  

  const handleUserSelection = (user) => {
    setSelectedReceiver(user);
    setIsUserModalOpen(false);
    setIsSendMoneyModalOpen(true);
  };

  const handleSendMoney = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/transactions/transfer",
        {
          sender: userIds, // Replace with logged-in user's ID
          receiver: selectedReceiver._id,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Transaction successful!");
        setAmount("");
        setSelectedReceiver(null);
        setIsSendMoneyModalOpen(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Financial Dashboard</h1>
      <button
        onClick={() => {
          setIsUserModalOpen(true);
          fetchUsers();
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Send Money
      </button>

      <TransactionSummary />
      <TransactionsTable />
      <RealTimeUpdates />

      {/* First Modal: Select User */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Select Receiver</h2>
            {error && <p className="text-red-500 mb-3">{error}</p>}
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => handleUserSelection(user)}
                >
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsUserModalOpen(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Second Modal: Send Money */}
      {isSendMoneyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              Send Money to {selectedReceiver?.name}
            </h2>
            {error && <p className="text-red-500 mb-3">{error}</p>}
            {success && <p className="text-green-500 mb-3">{success}</p>}
            <form onSubmit={handleSendMoney} className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsSendMoneyModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
