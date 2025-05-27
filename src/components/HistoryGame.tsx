"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Loader,
  Center,
  Alert,
  Text,
  Title,
  Card,
  Flex,
  Box,
} from "@mantine/core";
import { AiOutlineWarning } from "react-icons/ai";
import { format } from "date-fns";
import { DatePickerInput, DateValue } from "@mantine/dates";
import PaginationInfoLabel from "./paginationInfoLabel/paginationInfoLabel";
import PageSizeSelector from "./pageSizeSelector/pageSizeSelector";
import PaginationMantine from "./pagination/pagination";

export type HistoryEntry = { id: number; score: number; updated_at: string };

interface Props {
  id: string;
}

export default function HistoryGame({ id }: Props) {
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateValue>(new Date());
  const [totalHistories, setTotalHistories] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const controller = new AbortController();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/users/${id}/history/${format(
          selectedDate as Date,
          "yyyy-MM-dd"
        )}?page=${currentPage}&perPage=${perPage}`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { data, total } = await res.json();
      setHistory(data);
      setTotalHistories(total);
      console.log("history", res);
    } catch (e: unknown) {
      const message = (e as Error).message ?? "Unknown error";
      if (!controller.signal.aborted) {
        setError(message || "Failed to load");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id, selectedDate, currentPage, perPage]);

  return (
    <Card withBorder shadow="sm" radius="md" p="lg" my="xl">
      <Flex justify="space-between" align="center" mb="md">
        <Title order={4}>Game History</Title>
        <Text>Total: {totalHistories}</Text>
        <DatePickerInput
          clearable
          value={selectedDate}
          onChange={setSelectedDate}
          placeholder="Pick date"
        />
      </Flex>

      <Box miw={500} mb="md">
        {loading && (
          <Center>
            <Loader />
          </Center>
        )}

        {error && (
          <Alert color="red" icon={<AiOutlineWarning size={18} />}>
            {error}
          </Alert>
        )}

        {!loading && !error && (!history || history.length === 0) && (
          <Text>No game history available.</Text>
        )}

        {!loading && !error && history && history.length > 0 && (
          <Table striped highlightOnHover verticalSpacing="sm">
            <thead>
              <tr>
                <th>STT</th>
                <th>Id</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((e, i) => (
                <tr key={e.updated_at + i}>
                  <td>{i + 1 + (currentPage - 1) * perPage}</td>
                  <td>{e.id}</td>
                  <td>{e.score}</td>
                  <td>{new Date(e.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Box>

      <Flex justify="space-between" align="center" wrap="wrap" gap="md">
        <PaginationInfoLabel
          totalItem={totalHistories}
          currentPage={currentPage}
          perPage={perPage}
        />
        <PageSizeSelector
          value={perPage.toString()}
          onChange={(v) => {
            setPerPage(parseInt(v!));
            setCurrentPage(1);
          }}
        />
        <PaginationMantine
          data={{
            totalPage: Math.ceil(totalHistories / perPage),
            onChangeFunc: setCurrentPage,
          }}
        />
      </Flex>
    </Card>
  );
}
