"use client";

import { useState } from "react";
import { Box, Center, Flex } from "@mantine/core";

import TableMantine, { TableDataRequired } from "@/components/table/table";
import PaginationMantine from "@/components/pagination/pagination";
import SkeletonStack from "@/components/skeletonStack/skeletonStack";
import PaginationInfoLabel from "@/components/paginationInfoLabel/paginationInfoLabel";
import PageSizeSelector from "@/components/pageSizeSelector/pageSizeSelector";
import { useUserData } from "@/hooks/useUserData";

export default function UserFeatPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(20);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const { userRecords, totalItems, isLoading, error } = useUserData({
    searchKeyword,
    currentPage,
    perPage,
  });
  const handlePerPageChange = (value: string | null) => {
    if (value) {
      setPerPage(parseInt(value));
      setCurrentPage(1);
    }
  };

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
    body:
      userRecords?.map((user) => [
        user.id,
        user.username ?? "NULL",
        user.avatar_url ?? "NULL",
        user.score ?? "score",
        user.created_at,
        user.updated_at,
        user.last_updated_score,
      ]) || [],
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
              totalItem={totalItems}
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
                totalPage: Math.ceil(totalItems / perPage),
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
