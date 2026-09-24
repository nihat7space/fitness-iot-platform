import { useEffect, useRef, useState } from "react";

export function usePolling(fetcher, intervalMs, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let timer;

    async function tick() {
      try {
        const result = await fetcher();
        if (mounted.current) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (mounted.current) {
          setError(err);
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
          timer = setTimeout(tick, intervalMs);
        }
      }
    }

    setLoading(true);
    tick();

    return () => {
      mounted.current = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading };
}
