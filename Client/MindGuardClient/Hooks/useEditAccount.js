import { useDispatch } from "react-redux";
import { updateAccount, changePassword } from "../Redux/Slices/authSlice";

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

  const editPassword = async (
    currentPassword,
    newPassword,
    userId,
    accessToken
  ) => {
    try {
      await dispatch(
        changePassword({ currentPassword, newPassword, userId, accessToken })
      ).unwrap();
    } catch (error) {
      console.error("Failed to change password:", error);
      throw new Error("Failed to change password");
    }
  };

  return { editAccount, editPassword };
}
