"use client";

import { useCallback, useState } from "react";
import { Box, Button, Center, Flex, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import TableMantine, { sortOption } from "@/components/table/table";
import PaginationMantine from "@/components/pagination/pagination";
import SkeletonStack from "@/components/skeletonStack/skeletonStack";
import PaginationInfoLabel from "@/components/paginationInfoLabel/paginationInfoLabel";
import PageSizeSelector from "@/components/pageSizeSelector/pageSizeSelector";
import { useUserData } from "@/hooks/useUserData";
import SearchInput from "@/components/searchInput/searchInput";
import { HiPlus } from "react-icons/hi";
import CreateUserForm from "@/components/createUserForm/createUserForm";
import { FiRefreshCcw } from "react-icons/fi";
import { useReducer } from "react";

export default function UserFeatPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(20);
  const [opened, { open, close }] = useDisclosure(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [scoreOptionSort, setScoreOptionSort] = useState<sortOption>("DES");
  const [createdAtOptionSort, setCreatedAtOptionSort] =
    useState<sortOption>("DES");
  const { userRecords, totalItems, isLoading } = useUserData({
    searchKeyword,
    currentPage,
    perPage,
    scoreOptionSort,
    createdAtOptionSort,
  });

  const handlePerPageChange = useCallback((value: string | null) => {
    if (value) {
      setPerPage(parseInt(value));
      setCurrentPage(1);
    }
  }, []);

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <CreateUserForm onClose={close} />
      </Modal>
      <Box p={32}>
        <SearchInput
          onEnter={(searchKeyword) => {
            setSearchKeyword(searchKeyword);
          }}
        />
        {searchKeyword ? <Text>keyword:{searchKeyword}</Text> : null}
        <Flex justify="flex-end" py={8} gap={10}>
          <Button variant="filled" color="cyan" onClick={open}>
            <HiPlus />
          </Button>
          <Button onClick={forceUpdate}>
            <FiRefreshCcw />
          </Button>
        </Flex>
        {isLoading ? (
          <SkeletonStack size={perPage} />
        ) : (
          <TableMantine
            scoreOptionSort={scoreOptionSort}
            createAtOptionSort={createdAtOptionSort}
            users={userRecords || []}
            onOptionSortChange={(scoreOptionSort, createAtOptionSort) => {
              console.log("OPTION", scoreOptionSort, createAtOptionSort);
              setScoreOptionSort(scoreOptionSort);
              setCreatedAtOptionSort(createAtOptionSort);
            }}
          />
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
