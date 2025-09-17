import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux/Slices/authSlice";

export default function useLogin(navigation) {
  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let valid = true;

    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Enter a valid email");
        valid = false;
      }
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (validate()) {
      dispatch(login({ email, password })).unwrap();
    }
  };

  useEffect(() => {
    if (user) {
      navigation.replace("MainTabs");
    }
  }, [user]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    handleLogin,
    loading,
    error,
  };
}
