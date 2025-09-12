import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadEntriesAndPredict,
  predictNow,
} from "../Redux/Slices/insightSlice";

export function useInsights(user) {
  const dispatch = useDispatch();
  const { entries, risk, loading, error } = useSelector((s) => s.insights);

  useEffect(() => {
    if (user?.id && user?.accessToken) {
      dispatch(
        loadEntriesAndPredict({
          userId: user.id,
          accessToken: user.accessToken,
        })
      );
    }
  }, [user?.id, user?.accessToken, dispatch]);

  const onPredictNow = () => {
    dispatch(predictNow({ entries }));
  };

  return { entries, risk, loading, error, onPredictNow };
}
