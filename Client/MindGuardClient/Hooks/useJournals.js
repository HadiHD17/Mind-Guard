import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getJournals } from "../Redux/Slices/journalSlice";

export default function useJournals(userId) {
  const dispatch = useDispatch();
  const { journals, loading, error } = useSelector((state) => state.journal);

  useEffect(() => {
    if (userId) {
      dispatch(getJournals(userId));
    }
  }, [userId, dispatch]);

  return { journals, loading, error };
}
