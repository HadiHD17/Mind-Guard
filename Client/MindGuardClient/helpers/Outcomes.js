import api from "../Api";
import { getUserData } from "./Storage";

export async function postOutcome({ isCrisis, notes, occurredAt }) {
  const user = await getUserData();
  if (!user?.accessToken) throw new Error("Not authenticated");

  const payload = {
    userId: user.id,
    isCrisis,
    notes,
    occurredAt: occurredAt || new Date().toISOString(),
  };

  const res = await api.post("/Outcome", payload, {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  return res?.data?.payload ?? null;
}
