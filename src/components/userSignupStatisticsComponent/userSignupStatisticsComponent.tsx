import { LineChart } from "@mantine/charts";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, Select, Text } from "@mantine/core";
import { format, startOfMonth, addMonths } from "date-fns";
import { useProfileRealtime } from "@/context/ProfileRealtimeContext";

type SigUnpStaticData = {
  day: string;
  total: number;
};

type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function UserSignupStatisticsComponent() {
  const [data, setData] = useState<SigUnpStaticData[]>([]);
  const [month, setMonth] = useState<Month>(
    (new Date().getMonth() + 1) as Month
  );
  const [totalUserRegister, setTotalUserRegister] = useState<number>(0);
  const payload = useProfileRealtime();

  const fetchUserSignupStatisticsByMonthAndYear = useCallback(
    async (month: Month) => {
      const now = new Date();
      const year = now.getFullYear();
      const start = startOfMonth(new Date(year, month - 1, 1));
      const end = startOfMonth(addMonths(start, 1));

      try {
        const res = await fetch(
          `/api/user-growth?start_date=${format(
            start,
            "yyyy-MM-dd"
          )}&end_date=${format(end, "yyyy-MM-dd")}`
        );
        const json = await res.json();

        if (res.ok) {
          const mapped = json.data.map((entry: SigUnpStaticData) => ({
            day: format(new Date(entry.day), "MMM dd"),
            total: entry.total,
          }));

          const total = mapped.reduce(
            (sum: number, item: SigUnpStaticData) => sum + item.total,
            0
          );
          setData(mapped);
          setTotalUserRegister(total);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    },
    []
  );

  useEffect(() => {
    fetchUserSignupStatisticsByMonthAndYear(month);
  }, [month, fetchUserSignupStatisticsByMonthAndYear]);

  useEffect(() => {
    if (payload) {
      fetchUserSignupStatisticsByMonthAndYear(month);
    }
  }, [payload]);
  const chartSeries = useMemo(() => [{ name: "total", color: "indigo.6" }], []);

  return (
    <Card bg="#fff" shadow="md" padding="lg" radius={8}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text c="teal.4" fw={500} size="lg">
          User Signup Statistics
        </Text>
        <Text>Total signups: {totalUserRegister}</Text>
        <Select
          w={120}
          data={months}
          value={month.toString()}
          onChange={(val) => val && setMonth(parseInt(val) as Month)}
        />
      </div>

      <LineChart
        h={300}
        mt="md"
        data={data}
        dataKey="day"
        series={chartSeries}
        curveType="linear"
        connectNulls
      />
    </Card>
  );
}
