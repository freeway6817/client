import { useState, useCallback } from "react";
import api from "../api/axios";

export function useCrisisAlert() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertReason, setAlertReason] = useState(null);

  const triggerAlert = useCallback((reason = "general") => {
    setAlertReason(reason);
    setAlertOpen(true);
  }, []);

  const dismissAlert = useCallback(async () => {
    try {
      await api.post("/api/crisis/dismiss");
    } catch {
      // Non-fatal — modal still closes
    }
    setAlertOpen(false);
    setAlertReason(null);
  }, []);

  return { alertOpen, alertReason, triggerAlert, dismissAlert };
}
