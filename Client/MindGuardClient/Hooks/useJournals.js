import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getJournals, saveJournal } from "../Redux/Slices/journalSlice";

export default function useJournals(userId, accessToken) {
  const dispatch = useDispatch();
  const { journals, loading, error } = useSelector((state) => state.journal);

  useEffect(() => {
    if (userId && accessToken) {
      dispatch(getJournals({ userId, accessToken }));
    }
  }, [userId, accessToken, dispatch]);

  const addJournalEntry = (content) => {
    if (userId && accessToken) {
      dispatch(saveJournal({ content, userId, accessToken }));
    }
  };

  return { journals, loading, error, addJournalEntry };
}
