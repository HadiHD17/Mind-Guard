import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import userReducer from "./Slices/userSlice";
import moodReducer from "./Slices/moodSlice";
import routineReducer from "./Slices/routineSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    mood: moodReducer,
    routine: routineReducer,
  },
});
