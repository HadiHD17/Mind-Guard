import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getJournals } from "../Redux/Slices/journalSlice";
import useUser from "./useUser";

export default function useMoodMap() {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { journals, loading, error } = useSelector((state) => state.journal);

  const [markedDates, setMarkedDates] = useState({});
  const [selectedDayEntries, setSelectedDayEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(getJournals({ userId: user.id, accessToken: user.accessToken }));
    }
  }, [user, dispatch]);

  const processMarkedDates = () => {
    const marks = {};
    journals.forEach((entry) => {
      const date = entry.createdAt.split("T")[0];
      let color = "#808080";
      if (entry.detectedEmotion === "happy") color = "#4CAF50";
      else if (entry.detectedEmotion === "sad") color = "#2196F3";
      else if (entry.detectedEmotion === "angry") color = "#F44336";
      else if (entry.detectedEmotion === "neutral") color = "#FFC107";

      marks[date] = {
        marked: true,
        dotColor: color,
      };
    });
    setMarkedDates(marks);
  };

  useEffect(() => {
    if (journals.length > 0) {
      processMarkedDates();
    }
  }, [journals]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    const dayEntries = journals.filter((e) =>
      e.createdAt.startsWith(day.dateString)
    );
    setSelectedDayEntries(dayEntries);

    setMarkedDates((prev) => ({
      ...prev,
      [day.dateString]: {
        ...(prev[day.dateString] || {}),
        selected: true,
        selectedColor: "#000",
      },
    }));
  };

  return {
    journals,
    loading,
    error,
    markedDates,
    selectedDayEntries,
    selectedDate,
    handleDayPress,
  };
}
