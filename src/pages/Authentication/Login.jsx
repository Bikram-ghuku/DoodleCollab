import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import loginImg from "../../assets/register.jpg";
import { PasswordIcon, MailIcon } from "../../assets/RegisterIcons";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { useTheme } from "../../context/ThemeContext";
import "./auth.css";
import { useAppContext } from "../../context/AppContext";
import { useMutation } from "@tanstack/react-query";
import { ImSpinner9 } from "react-icons/im";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { showToast, updateLoggedIn } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const apiUrl = import.meta.env.VITE_API_URL;

  const { mutate: loginUserMutate, isPending: isLoginPending } = useMutation({
    mutationFn: (user) => axios.post(`${apiUrl}/api/users/login`, user),
  });

  const onSubmit = handleSubmit(({ email, password }) => {
    loginUserMutate(
      {
        email,
        password,
      },
      {
        onSuccess: (res) => {
          localStorage.setItem("token", res.data.token);
          updateLoggedIn(true);
          showToast({ message: "Login Successful!", type: "SUCCESS" });
          navigate("/sketchbook");
        },
        onError: () => {
          updateLoggedIn(false);
          showToast({ message: "Login Failed!", type: "ERROR" });
        },
      }
    );
  });

  return (
    <section
      className={`auth-section ${isDarkMode ? "dark-mode" : "white-mode"}`}
    >
      <div className="auth-img">
        <img src={loginImg} alt="registration image" />
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={onSubmit}>
          <h1 style={{ color: isDarkMode ? "white" : "black" }}>
            Welcome to DoodleCollab!
          </h1>
          <p style={{ color: isDarkMode ? "white" : "black" }}>
            Enter your Email, and Password!
          </p>
          <hr />
          <div className="auth-textbox">
            <MailIcon className="auth-icon" />
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", {
                required: "Email is required",
              })}
            />
          </div>
          {errors.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
          <div className="auth-textbox">
            <PasswordIcon className="auth-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <button
              aria-label="MdOutlineRemoveRedEye btn"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <MdOutlineRemoveRedEye size={20} />
              ) : (
                <AiOutlineEyeInvisible size={20} />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="error-message">{errors.password.message}</span>
          )}
          <button
            disabled={isLoginPending}
            className="w-full text-white justify-center p-3 rounded-lg inline-flex gap-3 items-center disabled:bg-black/50 transition-colors bg-black hover:bg-black/80 font-semibold text-base"
            type="submit"
          >
            {isLoginPending && <ImSpinner9 className="animate-spin" />}
            <span>Log in</span>
          </button>
          <div className="auth-textbox-footer">
            <span>
              New to DoodleCollab?{" "}
              <Link
                className="auth-link"
                to="/register"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Register
              </Link>
            </span>
            <span>
              Forget password?{" "}
              <Link
                className="auth-link"
                to="/"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Click here to find it
              </Link>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
