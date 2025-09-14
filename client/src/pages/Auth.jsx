import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authFields } from "../Data/Authfield"; 
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { showSuccessToast,showErrorToast, TOAST_MESSAGES } from '../components/Utils/Toast';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const modeFromUrl = searchParams.get("mode");
  const [mode, setMode] = useState(modeFromUrl || "login");

  const initialState = { name: "", email: "", password: "" };
  const [formData, setFormData] = useState(initialState);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (modeFromUrl) setMode(modeFromUrl);
    setFormData(initialState);
    setPasswordError("");
    setShowPassword(false);
  }, [modeFromUrl]);

  const validatePassword = (pwd) => {
    if (mode !== "register") return;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    setPasswordError(
      regex.test(pwd)
        ? ""
        : "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password") validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "register" && passwordError) return;

    try {
      if (mode === "register") {
        await axios.post("http://localhost:4000/api/users/register", formData);
        alert("Registration successful! Please login.");
        setMode("login");
        setFormData(initialState);
      } else {

        const response = await axios.post("http://localhost:4000/api/users/login", formData);

        localStorage.setItem("user", JSON.stringify(response.data.user));
        login(response.data.token, response.data.user.role);
        
        showSuccessToast(TOAST_MESSAGES.LOGIN_SUCCESS);

        if (response.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (response.data.user.role === "candidate") {
          navigate("/candidate-dashboard");
        } else if (response.data.user.role === "interviewer") {
          navigate("/interviewer-dashboard");
        } else {
          navigate("/");
        }

      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      showErrorToast(error.response?.data?.message || TOAST_MESSAGES.LOGIN_FAILED);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Login to CodeCollab" : "Create your CodeCollab account"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {authFields[mode].map((field) => {
            if (field.name === "password") {
              return (
                <div key={field.name} className="space-y-1">
                  <div className="relative">
                    <input
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      required={field.required}
                      onChange={handleChange}
                      className="w-full p-3 pr-16 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-0 h-full flex items-center text-slate-300 hover:text-white"
                    >
                      {showPassword ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                  )}
                </div>
              );
            }

            return (
              <input
                key={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name]}
                required={field.required}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            );
          })}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-blue-400 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-400 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
