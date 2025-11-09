import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout.jsx";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector.jsx";
import Input from "../../components/inputs/Input.jsx";
import { Link } from "react-router-dom"; // Added Link
import { validateEmail } from "../../utils/helper.js"; // Correct import
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { UserContext } from "../../context/userContent.jsx";
import { useNavigate } from "react-router-dom";
import uploadImage from "../../utils/uploadImage.js";
// FIX 1: Added missing import
// LuTarget import removed (unused)

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    // Reset error on new submission

    // --- Validation ---
    if (!fullName) {
      setError("Please enter your full Name.");
      return;
    }

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
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.url || ""; // ✅ FIXED
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

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
      <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>

        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          {/* FIX 4: Grid now *only* contains the inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={(value) => setFullName(value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
              required
            />
            <Input
              value={email}
              onChange={(value) => setEmail(value)}
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              required
            />
            <Input
              value={password}
              onChange={(value) => setPassword(value)}
              label="Password"
              placeholder="Enter your password"
              type="password"
              required
            />
            <Input
              // FIX 2: Use the correct state value
              value={adminInviteToken}
              // FIX 3: Use the correct onChange handler style
              onChange={(value) => setAdminInviteToken(value)}
              label="Admin Invite Token (Optional)"
              placeholder="7 Digit Code"
              type="text"
            />
          </div>

          {/* FIX 4: Error, Button, and Link are moved *after* the grid div */}
          {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

          <button type="submit" className="btn-primary mt-6">
            Sign Up
          </button>

          <p className="text-[13px] text-slate-800 mt-4 text-center">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
