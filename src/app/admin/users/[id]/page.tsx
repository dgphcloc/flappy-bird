"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import UserDetailCard from "@/components/UserDetailCard/userDetailCard";
import { UserRecord } from "@/type/type";
import { fetchUserById } from "../../_action";
import { Box, SimpleGrid } from "@mantine/core";
import Custom404 from "@/components/custom404";
import AverageScoreByUser from "@/components/averageScorebyUser";
import HistoryGame from "@/components/HistoryGame";
import TodayGameCount from "@/components/TodayGameCount";
import HighestScore from "@/components/highestScore";
import HourlyMatchChart from "@/components/HourlyMatchChart";
import DailyMatchChart from "@/components/DailyMatchChart";
import AddHistoryGame from "@/components/addHistoryGame";
export default function UserDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [user, setUser] = useState<UserRecord | null>(null);
  // function onRender(
  //   id,
  //   phase,
  //   actualDuration,
  //   baseDuration,
  //   startTime,
  //   commitTime
  // ) {
  //   // Aggregate or log render timings...
  //   console.log(id, phase, actualDuration, baseDuration, startTime, commitTime);
  // }
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
  return (
    <>
      <Box p={32} mih={1000}>
        <div>
          {user ? (
            <>
              <UserDetailCard user={user} reFetchUser={reFetchUser} />
              <SimpleGrid cols={3} spacing="lg">
                <AverageScoreByUser id={user.id} />
                <TodayGameCount id={user.id} />
                <HighestScore id={user.id} />
              </SimpleGrid>
              <HourlyMatchChart userId={user.id} />
              <DailyMatchChart id={user.id} />
              <AddHistoryGame id={user.id} />
              <HistoryGame id={user.id} />
            </>
          ) : (
            <Custom404 />
          )}{" "}
        </div>
      </Box>
    </>
  );
}
