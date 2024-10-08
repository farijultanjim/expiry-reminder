"use client";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);


  const toggleForm = () => {
    setIsLogin(!isLogin);
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Login to Your Account" : "Create Your Account"}
        </h2>

        {isLogin ? <LoginForm /> : <RegistrationForm />}

        <div className="text-center mt-4">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <span
                onClick={toggleForm}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Register here
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                onClick={toggleForm}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setIsLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSuccess("Login successful!");
        router.push("/home");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsFormValid(email && password);
  }, [email, password]);

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="relative">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Enter your password"
            className="mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 cursor-pointer"
          >
            {showPassword ? "👁️" : "🙈"}
          </span>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <button
        type="submit"
        className={`w-full py-3 rounded-md ${
          isFormValid
            ? "bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!isFormValid}
      >
        {isLoading ? <Loader /> : "Login"}
      </button>
    </form>
  );
};

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  useEffect(() => {
    if (
      name &&
      email &&
      password &&
      confirmPassword &&
      validatePassword(password) &&
      password === confirmPassword
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setIsLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      console.log(result);
      if (response.ok && result.success) {
        setSuccess("Registration successful! You can now log in.");
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Registration failed", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          placeholder="Enter your name"
          className="mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="relative">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Create a password"
            className={`mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
              validatePassword(password)
                ? "focus:ring-blue-600"
                : "focus:ring-red-500"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 cursor-pointer"
          >
            {showPassword ? "👁️" : "🙈"}
          </span>
        </div>
        <div className="min-h-[1.5rem]">
          {!validatePassword(password) && password && (
            <p className="text-xs text-red-500 mt-1">
              Must have at least 8 characters, 1 uppercase, 1 lowercase, 1
              number, 1 special character.
            </p>
          )}
        </div>
      </div>

      <div className="relative">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="flex items-center">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirm your password"
            className={`mt-1 block w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
              password === confirmPassword && confirmPassword
                ? "focus:ring-blue-600"
                : "focus:ring-red-500"
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 cursor-pointer"
          >
            {showConfirmPassword ? "👁️" : "🙈"}
          </span>
        </div>
        <div className="min-h-[1.5rem]">
          {password !== confirmPassword && confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
          )}
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <button
        type="submit"
        className={`w-full py-3 rounded-md ${
          isFormValid
            ? "bg-green-600 text-white hover:bg-green-700 transition duration-300"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!isFormValid}
      >
        {isLoading ? <Loader /> : "Register"}
        
      </button>
    </form>
  );
};

export default AuthPage;
