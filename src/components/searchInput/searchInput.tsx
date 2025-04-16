"use client";

import { useRouter } from "next/navigation";
import { useSearchShortcut } from "@/hooks/useSearchShorcut";
import { Loader, Select } from "@mantine/core";
import { useRef, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { fetchUsersByPage } from "@/app/admin/_action";
import { UserRecord } from "@/type/type";

export default function SearchInput() {
  const selectRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserRecord[] | null>(null);
  useSearchShortcut(selectRef);
  const handleSearch = useDebouncedCallback(async (query: string) => {
    console.log(query);
    setLoading(true);
    if (!query) {
      setLoading(false);
      return;
    }
    const result = await fetchUsersByPage(1, 15, query);
    if (result && result.data) {
      console.log("data:", result.data);
      setData(result.data);
    }

    setLoading(false);
  }, 500);
  return (
    <Select
      value={searchKeyword}
      placeholder="Search..."
      searchable
      onSearchChange={handleSearch}
      data={data?.map((user) => ({
        value: user.id,
        label: user.username,
      }))}
      ref={selectRef}
      rightSection={loading && <Loader size={20} />}
      onChange={(value) => {
        console.log("Selected username:", value);
        router.push(`/admin/users/${value}`);
        setSearchKeyword(value || "");
      }}
    />
  );
}
