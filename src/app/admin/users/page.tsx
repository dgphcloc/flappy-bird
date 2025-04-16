"use client";

import { useState } from "react";
import { Box, Button, Center, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import TableMantine, { TableDataRequired } from "@/components/table/table";
import PaginationMantine from "@/components/pagination/pagination";
import SkeletonStack from "@/components/skeletonStack/skeletonStack";
import PaginationInfoLabel from "@/components/paginationInfoLabel/paginationInfoLabel";
import PageSizeSelector from "@/components/pageSizeSelector/pageSizeSelector";
import { useUserData } from "@/hooks/useUserData";
import SearchInput from "@/components/searchInput/searchInput";
import { HiPlus } from "react-icons/hi";
import CreateUserForm from "@/components/createUserForm/createUserForm";

export default function UserFeatPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(20);
  const [opened, { open, close }] = useDisclosure(false);
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
    <>
      <Modal opened={opened} onClose={close}>
        <CreateUserForm onClose={close} />
      </Modal>
      <Box p={32}>
        <SearchInput />
        <Flex justify="flex-end" py={8}>
          <Button variant="filled" color="cyan" onClick={open}>
            <HiPlus />
          </Button>
        </Flex>
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
    </>
  );
}
