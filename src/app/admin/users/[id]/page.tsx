"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import UserDetailCard from "@/components/UserDetailCard/userDetailCard";
import { UserRecord } from "@/type/type";
import { fetchUserById } from "../../_action";
import { Box } from "@mantine/core";
import Custom404 from "@/components/custom404";
export default function UserDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [user, setUser] = useState<UserRecord | null>(null);
  const reFetchUser = useCallback(async (id: string) => {
    const result = await fetchUserById(id);
    setUser(result);
  }, []);

  useEffect(() => {
    if (!id) return;
    // const fetchUser = async () => {
    //   const result = await fetchUserById(id);
    //   setUser(result);
    // };
    reFetchUser(id);
  }, [id]);
  //can goi lai khi co thay doi

  return (
    <>
      <Box p={32} mih={1000}>
        <div>
          {user ? (
            <UserDetailCard user={user} reFetchUser={reFetchUser} />
          ) : (
            <Custom404 />
          )}{" "}
        </div>
      </Box>
    </>
  );
}
