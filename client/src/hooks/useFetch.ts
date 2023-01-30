import { Dispatch, SetStateAction, useCallback, useState } from "react";

export default function useFetch() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(
    async (
      url: string,
      setError: Dispatch<SetStateAction<string>>,
      applyData: (param: any) => any,
      requestSettings?: any
    ) => {
      setIsLoading(true);
      setError("");

      try {
        const res: Response = await fetch(url, requestSettings);
        const data: any = await res.json();

        applyData(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { isLoading, fetchData };
}
