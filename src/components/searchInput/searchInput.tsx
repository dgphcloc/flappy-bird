"use client";

import { useRouter } from "next/navigation";
import { useSearchShortcut } from "@/hooks/useSearchShorcut";
import { Loader, Select, Portal, Overlay } from "@mantine/core";
import { useRef, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { fetchUsersByPage } from "@/app/admin/_action";
import { UserRecord } from "@/type/type";

export default function SearchInput({
  onEnter,
}: {
  onEnter?: (keyword: string) => void;
}) {
  const selectRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserRecord[] | null>(null);
  // state to control overlay blur
  const [dropdownOpened, setDropdownOpened] = useState(false);

  useSearchShortcut(selectRef);

  const handleSearch = useDebouncedCallback(async (query: string) => {
    setLoading(true);
    setSearchKeyword(query);
    const result = await fetchUsersByPage(1, 15, query);
    if (result?.data) {
      setData(result.data);
    }
    setLoading(false);
  }, 500);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onEnter?.(event.currentTarget.value);
    }
  };

  return (
    <>
      {dropdownOpened && (
        <Portal>
          <Overlay
            color="#fff"
            backgroundOpacity={0.2}
            fixed // full-screen
            blur={4} // backdrop-filter: blur(4px)
            zIndex={5} // below select
          />
        </Portal>
      )}

      <Select
        ref={selectRef}
        value={searchKeyword}
        placeholder="Search..."
        searchable
        clearable
        allowDeselect
        // Pass into `comboboxProps` to portal the dropdown and set the z-index.
        comboboxProps={{
          withinPortal: true,
          zIndex: 10, // higher than the overlay
        }}
        onSearchChange={(q) => {
          setSearchKeyword(q);
          handleSearch(q);
        }}
        data={data?.map((user) => ({
          value: user.id,
          label: user.username,
        }))}
        rightSection={loading && <Loader size={20} />}
        onChange={(value) => {
          router.push(`/admin/users/${value}`);
          setSearchKeyword(value || "");
        }}
        onKeyDown={handleKeyDown}
        onDropdownOpen={() => setDropdownOpened(true)}
        onDropdownClose={() => setDropdownOpened(false)}
        styles={{
          dropdown: {
            border: "1px solid #228BE6",
            borderRadius: 8,
          },
          input: {
            position: "relative",
            zIndex: 10,
          },
        }}
      />
    </>
  );
}
