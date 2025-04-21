import { Card, Group, Text, ThemeIcon } from "@mantine/core";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function RegisterStatisToday() {
  const isPositive = true;
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between">
        <div>
          <Text size="lg" fw={700}>
            Today
          </Text>
          <Text size="xl" fw={900}>
            69 new user
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
        100% so với hôm qua
      </Text>
    </Card>
  );
}
