import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMoods, logMood } from "../Redux/Slices/moodSlice";
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
      const moodsArray = Array.isArray(moods) ? moods : [moods];
      const processedMoods = moodsArray.map((item) => ({
        day: getDayOfWeek(new Date(item.date ?? item.createdAt)),
        mood: moodToEmoji[(item.mood_Label ?? "").toLowerCase().trim()],
      }));

      const uniqueMoods = Array.from(
        processedMoods
          .reduce((map, obj) => map.set(obj.day, obj), new Map())
          .values()
      );

      setUniqueMoodsByDay(uniqueMoods);
    }
  }, [moods]);

  const handleLogMood = useCallback(
    (mood) => {
      if (!userId) return;
      dispatch(logMood({ userId, mood }));
    },
    [dispatch, userId]
  );

  return { moods: uniqueMoodsByDay, loading, error, handleLogMood };
}
