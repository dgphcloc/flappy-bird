"use client";
import { SimpleGrid } from "@mantine/core";
import HighestScoreToday from "@/components/highestScoreToday";
import RegisterStatisToday from "@/components/RegisterStatisToday/RegisterStatisToday";
import TotalGamesToday from "@/components/totalGamesToday";
import UserSignupStatisticsComponent from "@/components/userSignupStatisticsComponent/userSignupStatisticsComponent";
import { Box } from "@mantine/core";
import DailyMatchesStatistics from "@/components/dailyMatchesStatistics";
export default function AdminPage() {
  /**
   *  thong ke user dang ki theo thang => cho phep chon thang,chon nam
   * tong so user dang ki trong ngay, tuan,thang,nam => cho phep chon ngay thang nam
   *
   */
  return (
    <>
      <Box p={40}>
        <Box mb={20}>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            <RegisterStatisToday />
            <TotalGamesToday />
            <HighestScoreToday />
          </SimpleGrid>
        </Box>
        <UserSignupStatisticsComponent />
        <DailyMatchesStatistics />
      </Box>
    </>
  );
}
