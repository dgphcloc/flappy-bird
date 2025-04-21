import { LineChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import { Box, Select, Text } from "@mantine/core";
import { format, startOfMonth, endOfMonth } from "date-fns";
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
  const [data, setData] = useState<SigUnpStaticData[] | []>([]);
  const [month, setMonth] = useState<Month>(4);

  const fetchUserSignupStatisticsByMonthAndYear = async (month: Month) => {
    const now = new Date();
    const year = now.getFullYear();
    const start = startOfMonth(new Date(year, month - 1, 1));
    const end = endOfMonth(start);

    try {
      const res = await fetch(
        `/api/user-growth?start_date=${format(
          start,
          "yyyy-MM-dd"
        )}&end_date=${format(end, "yyyy-MM-dd")}`
      );
      const json = await res.json();

      if (res.ok) {
        console.log(json);
        const mapped = json.data.map((entry: SigUnpStaticData) => ({
          day: format(new Date(entry.day), "MMM dd"),
          total: entry.total,
        }));
        setData(mapped);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUserSignupStatisticsByMonthAndYear(month);
  }, [month]);

  return (
    <>
      <Box>
        <Text c="teal.4">User Signup Statistics</Text>
        <Select
          w={120}
          data={months}
          value={month.toString()}
          onChange={(val) => {
            if (val) {
              const selectedMonth = parseInt(val) as Month;
              setMonth(selectedMonth);
            }
          }}
        />
        <LineChart
          h={300}
          data={data}
          dataKey="day"
          series={[{ name: "total", color: "indigo.6" }]}
          curveType="linear"
          connectNulls
        />
      </Box>
    </>
  );
}
