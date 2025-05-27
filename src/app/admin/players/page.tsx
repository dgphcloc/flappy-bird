import ActivePercentageChart from "@/components/ActivePercentageChart";
import TopAllTimePlayers from "@/components/topAllTimePlayer";
import TopPlayerOfThisMonthChart from "@/components/topPlayerOfThisMonthChart";
import TopPlayersOfThisWeekChart from "@/components/topPlayersOfThisWeekChart";
import { SimpleGrid } from "@mantine/core";

export default function Player() {
  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 3 }} p={20}>
        <TopAllTimePlayers />
        <TopPlayerOfThisMonthChart />
        <TopPlayersOfThisWeekChart />
      </SimpleGrid>
      <ActivePercentageChart />
    </>
  );
}
