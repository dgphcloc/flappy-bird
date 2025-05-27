"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Text,
  Loader,
  Center,
  Alert,
  Stack,
  Title,
  Group,
} from "@mantine/core";
import { AiOutlineWarning } from "react-icons/ai";
import { FaGamepad, FaChartBar } from "react-icons/fa";
import { useRealtime } from "@/context/SubscriptionProvider";

type Props = {
  id: string;
};

export default function AverageScoreByUser({ id }: Props) {
  const [data, setData] = useState<{
    average_score: number;
    total_game: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const payload = useRealtime();
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/users/${id}/average`);
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();
      setData(result);
    } catch (e) {
      console.error(e);
      setError("Không thể tải dữ liệu điểm trung bình.");
    }
  };
  useEffect(() => {
    if (id) fetchData();
  }, [id]);
  useEffect(() => {
    if (payload) {
      fetchData();
    }
  }, [payload]);
  if (error)
    return (
      <Alert
        color="red"
        title="Lỗi"
        icon={<AiOutlineWarning size={20} />}
        variant="light"
      >
        {error}
      </Alert>
    );

  if (!data)
    return (
      <Card>
        <Center my="xl">
          <Loader color="blue" size="lg" />
        </Center>
      </Card>
    );

  return (
    <Card withBorder shadow="md" radius="md" p="lg" my="xl">
      <Stack gap="md">
        <Title order={4}>📊 Thống kê người dùng</Title>

        <Group justify="space-between">
          <Group gap="xs">
            <FaChartBar />
            <Text fw={500}>Điểm trung bình:</Text>
          </Group>
          <Text>{Math.round(data.average_score)}</Text>
        </Group>

        <Group justify="space-between">
          <Group gap="xs">
            <FaGamepad />
            <Text fw={500}>Tổng số trận:</Text>
          </Group>
          <Text>{data.total_game}</Text>
        </Group>
      </Stack>
    </Card>
  );
}
