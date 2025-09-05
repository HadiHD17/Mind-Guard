import { useDispatch } from "react-redux";
import { updateAccount } from "../Redux/Slices/authSlice";

export default function useEditAccount() {
  const dispatch = useDispatch();

  const editAccount = async (fullName, email, phone, userId, accessToken) => {
    try {
      await dispatch(
        updateAccount({ fullName, email, phone, userId, accessToken })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update account:", error);
      throw new Error("Failed to update account");
    }
  };

  return { editAccount };
}
