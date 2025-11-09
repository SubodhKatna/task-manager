import React, { useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout.jsx";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input.jsx";
import { validateEmail } from "../../utils/helper.js"; // Correct import
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { UserContext } from "../../context/userContent.jsx";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    // --- Your validation (perfect) ---
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    //Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        //Redirect based on role
        //Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>
        <form onSubmit={handleLogin}>
          <Input
            value={email}
            // --- THIS IS THE FIX ---
            onChange={(value) => setEmail(value)}
            // ------------------------
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            required
          />
          <Input
            value={password}
            // --- THIS IS THE FIX ---
            onChange={(value) => setPassword(value)}
            // ------------------------
            label="Password"
            placeholder="Enter your password"
            type="password"
            required // <-- Fixed typo "requird"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;

// The validateEmail function should be in its own file: /utils/helper.js
// I have removed it from here.
