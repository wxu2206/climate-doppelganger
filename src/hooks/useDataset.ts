import { useEffect, useState } from "react";
import type { Dataset } from "../types";
import { loadDataset } from "../data/validate";
export function useDataset() {
  const [data, setData] = useState<Dataset | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    loadDataset(controller.signal)
      .then(setData)
      .catch((e: Error) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => controller.abort();
  }, []);
  return { data, error };
}
