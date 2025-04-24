"use client";
import { Card, Group, Text, ThemeIcon } from "@mantine/core";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { addDays, format, subDays } from "date-fns";
import { useEffect, useState } from "react";

export default function RegisterStatisToday() {
  const [todayStatistics, setTodayStatistics] = useState<number>(0);
  const [yesterdayStatistics, setYesterdayStatistics] = useState<number>(0);
  const isPositive = todayStatistics - yesterdayStatistics > 0 ? true : false;

  const getTodayAndYesterdayUserSignupCounts = async () => {
    /**
     * Fetch the number of user registrations from yesterday to today.
     *
     * Note:
     * - `yesterday`: used as the start_date
     * - `tomorrow`: used as the end_date to include today's entire data range
     */
    const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
    console.log("TODAY", tomorrow, "YESTERDAY", yesterday);
    try {
      const res = await fetch(
        `/api/user-growth?start_date=${yesterday}&end_date=${tomorrow}`
      );
      const { data } = await res.json();

      if (res.ok) {
        console.log("DU LIEU THONG KE", data);
        setYesterdayStatistics(data.at(0).total);
        setTodayStatistics(data.at(1).total);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    getTodayAndYesterdayUserSignupCounts();
  }, []);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between">
        <div>
          <Text size="lg" fw={700}>
            Today
          </Text>
          <Text size="xl" fw={900}>
            {todayStatistics} new user
          </Text>
        </div>
        <ThemeIcon
          color={isPositive ? "green" : "red"}
          variant="light"
          radius="xl"
          size="lg"
        >
          {isPositive ? <FaArrowUp /> : <FaArrowDown />}
        </ThemeIcon>
      </Group>
      <Text color={isPositive ? "green" : "red"} size="sm" mt="sm">
        {isPositive ? "+" : ""}
        {todayStatistics - yesterdayStatistics} Compared to yesterday
      </Text>
    </Card>
  );
}
