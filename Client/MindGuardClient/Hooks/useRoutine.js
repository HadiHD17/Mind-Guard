import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getRoutine,
  loadRoutines,
  handleDelete,
  handleMarkComplete,
  handleUpdateDays,
  addRoutine,
} from "../Redux/Slices/routineSlice";

export default function useRoutine(userId, accessToken) {
  const dispatch = useDispatch();
  const { routines, routine, loading, error } = useSelector(
    (state) => state.routine
  );

  useEffect(() => {
    if (userId && accessToken) {
      dispatch(loadRoutines({ userId, accessToken }));
    }
  }, [userId, accessToken, dispatch]);

  useEffect(() => {
    if (userId && accessToken) {
      dispatch(getRoutine({ userId, accessToken }));
    }
  }, [userId, accessToken, dispatch]);

  const handleDeleteRoutine = (routineId) => {
    if (userId && accessToken) {
      dispatch(handleDelete({ routineId, accessToken }));
    }
  };

  const handleMarkCompleteRoutine = (routineId) => {
    if (userId && accessToken) {
      dispatch(handleMarkComplete({ routineId, accessToken }));
    }
  };

  const handleUpdateRoutineDays = (routineId, newDays) => {
    if (userId && accessToken) {
      dispatch(handleUpdateDays({ routineId, newDays, accessToken }));
    }
  };

  const handleAddRoutine = (title, time, selectedDays) => {
    if (userId && accessToken) {
      dispatch(addRoutine({ title, time, selectedDays, userId, accessToken }));
    }
  };

  return {
    routine,
    routines,
    loading,
    error,
    handleDeleteRoutine,
    handleMarkCompleteRoutine,
    handleUpdateRoutineDays,
    handleAddRoutine,
  };
}
