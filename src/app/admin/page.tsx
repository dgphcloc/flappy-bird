"use client";

import RegisterStatisToday from "@/components/RegisterStatisToday/RegisterStatisToday";
import UserSignupStatisticsComponent from "@/components/userSignupStatisticsComponent/userSignupStatisticsComponent";
import { Box } from "@mantine/core";

export default function AdminPage() {
  /**
   *  thong ke user dang ki theo thang => cho phep chon thang,chon nam
   * tong so user dang ki trong ngay, tuan,thang,nam => cho phep chon ngay thang nam
   *
   */
  return (
    <>
      <Box p={40}>
        <RegisterStatisToday />
        <UserSignupStatisticsComponent />
      </Box>
    </>
  );
}
