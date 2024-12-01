// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { login } from "../utils/api";
// // import { login } from "../utils/api";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await login({ email, password });
//       localStorage.setItem("token", data.token);
//       navigate("/");
//     } catch (err) {
//       alert("Login failed!");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
//         <h1 className="text-2xl font-bold mb-4">Login</h1>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full mb-3 p-2 border rounded"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full mb-3 p-2 border rounded"
//         />
//         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
//           Login
//         </button>
//         <p className="mt-4">
//           Don't have an account?{" "}
//           <a href="/signup" className="text-blue-600">
//             Signup
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }










import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Direct API call
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const { token } = response.data;

      // Store token in local storage
      localStorage.setItem("token", token);

      // Navigate to home page
      navigate("/");
    } catch (err) {
      // Display error message
      alert("Login failed! Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
        <p className="mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600">
            Signup
          </a>
        </p>
      </form>
    </div>
  );
}
