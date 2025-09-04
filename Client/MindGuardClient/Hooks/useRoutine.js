import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getRoutine } from "../Redux/Slices/routineSlice";

export default function useRoutine(userId) {
  const dispatch = useDispatch();
  const { routine, loading, error } = useSelector((state) => state.routine);

  useEffect(() => {
    if (userId) {
      dispatch(getRoutine(userId));
    }
  }, [userId, dispatch]);

  return { routine, loading, error };
}
