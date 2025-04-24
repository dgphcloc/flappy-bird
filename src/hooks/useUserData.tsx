import { fetchUsersByPage } from "@/app/admin/_action";
import { UserRecord } from "@/type/type";
import { useEffect, useRef, useState } from "react";

interface UseUserDataParams {
  searchKeyword: string;
  currentPage: number;
  perPage: number;
}

interface UseUserDataResult {
  userRecords: UserRecord[] | null;
  totalItems: number;
  isLoading: boolean;
  error: Error | null;
}

export const useUserData = ({
  searchKeyword,
  currentPage,
  perPage,
}: UseUserDataParams): UseUserDataResult => {
  const [state, setState] = useState<UseUserDataResult>({
    userRecords: null,
    totalItems: 0,
    isLoading: false,
    error: null,
  });
  const controllerRef = useRef(new AbortController());
  useEffect(() => {
    console.log("[useUserData] useEffect is running with:", {
      searchKeyword,
      currentPage,
      perPage,
    });
    const controller = controllerRef.current;

    let isMounted = true;

    const fetchData = async () => {
      try {
        console.log(
          "SEARCH KEYWORD DATA THAY DOI, KICH HOAT LAI RE-RENDER",
          searchKeyword
        );
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const result = await fetchUsersByPage(
          currentPage,
          perPage,
          searchKeyword
        );
        if (isMounted && result) {
          setState({
            userRecords: result.data,
            totalItems: result.total,
            isLoading: false,
            error: null,
          });
        }
        console.log("KET QUA CUA RE-RENDER LA", result, state);
      } catch (e) {
        if (isMounted && !controller.signal.aborted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: e instanceof Error ? e : new Error("Failed to fetch users"),
          }));
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
      console.log("[useUserData] Component using this hook is unmounting.");
    };
  }, [currentPage, perPage, searchKeyword]);

  return state;
};
