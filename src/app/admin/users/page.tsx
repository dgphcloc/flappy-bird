"use client";

import { useEffect, useState } from "react";
import { Box, Center, Flex } from "@mantine/core";

import TableMantine, { TableDataRequired } from "@/components/table/table";
import PaginationMantine from "@/components/pagination/pagination";
import SkeletonStack from "@/components/skeletonStack/skeletonStack";
import PaginationInfoLabel from "@/components/paginationInfoLabel/paginationInfoLabel";
import PageSizeSelector from "@/components/pageSizeSelector/pageSizeSelector";

import { fetchUsersByPage, PaginatedResult } from "../_action";
import { UserRecord } from "@/type/type";

export default function UserFeatPage() {
  const [userRecord, setUserRecord] = useState<UserRecord[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalItem, setTotalItem] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(20);

  const handlePerPageChange = (value: string | null) => {
    if (value) {
      setPerPage(parseInt(value));
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data, total } = (await fetchUsersByPage(
        currentPage,
        perPage
      )) as PaginatedResult<UserRecord>;

      if (data && total > 0) {
        setUserRecord(data);
        setTotalItem(total);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, perPage]);

  if (!userRecord) return;

  const tableData: TableDataRequired = {
    head: [
      "id",
      "username",
      "avatar",
      "score",
      "created at",
      "updated at",
      "last updated score",
    ],
    body: userRecord.map((user) => [
      user.id,
      user.username ?? "NULL",
      user.avatar_url ?? "NULL",
      user.score ?? "score",
      user.created_at,
      user.updated_at,
      user.last_updated_score,
    ]),
  };

  return (
    <Box p={32}>
      {isLoading ? (
        <SkeletonStack size={perPage} />
      ) : (
        <TableMantine data={tableData} />
      )}

      <Center mt="md">
        <Box w="100%">
          <Flex justify="space-between" align="center" wrap="wrap" gap="md">
            <PaginationInfoLabel
              totalItem={totalItem}
              currentPage={currentPage}
              perPage={perPage}
            />

            <Flex align="center" gap={8}>
              <PageSizeSelector
                value={perPage.toString()}
                onChange={handlePerPageChange}
              />
            </Flex>

            <PaginationMantine
              data={{
                totalPage: Math.ceil(totalItem / perPage),
                onChangeFunc: (page) => {
                  setCurrentPage(page);
                },
              }}
            />
          </Flex>
        </Box>
      </Center>
    </Box>
  );
}
