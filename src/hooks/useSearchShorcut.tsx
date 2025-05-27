import { useEffect, useCallback } from "react";

export function useSearchShortcut(
  inputRef: React.RefObject<HTMLInputElement | null>
): void {
  const handleGlobalKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    },
    [inputRef]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);
}
