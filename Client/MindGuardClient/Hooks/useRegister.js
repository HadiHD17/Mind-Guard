import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../Redux/Slices/authSlice";

export default function useRegister(navigation) {
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email";
    if (!password.trim()) newErrors.password = "Password is required";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!phoneNumber.trim()) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validate()) {
      try {
        await dispatch(
          register({ fullName, email, password, phoneNumber })
        ).unwrap();
      } catch (error) {
        console.error("Registration failed:", error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      navigation.replace("MainTabs");
    }
  }, [user]);

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    phoneNumber,
    setPhoneNumber,
    errors,
    handleRegister,
    loading,
    error,
  };
}
