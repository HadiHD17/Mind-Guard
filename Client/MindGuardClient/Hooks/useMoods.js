import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMoods } from "../Redux/Slices/moodSlice";
import { moodToEmoji, getDayOfWeek } from "../Helpers/MoodHelpers";

export default function useMoods(userId) {
  const dispatch = useDispatch();
  const { moods, loading, error } = useSelector((state) => state.mood);

  const [uniqueMoodsByDay, setUniqueMoodsByDay] = useState([]);

  useEffect(() => {
    if (userId) {
      dispatch(getMoods(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (moods) {
      const processedMoods = moods.map((item) => ({
        day: getDayOfWeek(item.date),
        mood: moodToEmoji[item.mood_Label] || "❓",
      }));

      const uniqueMoods = Array.from(
        processedMoods
          .reduce((map, obj) => map.set(obj.day, obj), new Map())
          .values()
      );

      setUniqueMoodsByDay(uniqueMoods);
    }
  }, [moods]);

  return { moods: uniqueMoodsByDay, loading, error };
}
