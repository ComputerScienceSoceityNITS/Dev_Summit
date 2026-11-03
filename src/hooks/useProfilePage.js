import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function useProfilePage({ authLoading, user }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRegistrations = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const { registrations: userRegistrations } = await api.myRegistrations();
      setRegistrations(userRegistrations);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setRegistrations([]);
      setLoading(false);
      setError("");
      return;
    }

    loadRegistrations();
  }, [authLoading, loadRegistrations, user]);

  return {
    error,
    loadRegistrations,
    loading,
    registrations,
  };
}
