import { Table, Box, Avatar, Flex } from "@mantine/core";
import Link from "next/link";
import { PATH_ADMIN } from "@/routes";
import { UserRecord } from "@/type/type";

import SortTableIcon from "../sortTableIcon";
import { useEffect } from "react";

export const toggleSort = (current: sortOption): sortOption => {
  return current === "ASC" ? "DES" : "ASC";
};

export type sortOption = "DES" | "ASC";
type UserTableProps = {
  users: UserRecord[];
  scoreOptionSort: sortOption;
  createAtOptionSort: sortOption;
  onOptionSortChange: (
    scoreOptionSort: sortOption,
    createAtOptionSort: sortOption
  ) => void;
};

export default function TableMantine({
  users,
  onOptionSortChange,
  scoreOptionSort,
  createAtOptionSort,
}: UserTableProps) {
  useEffect(() => {
    onOptionSortChange?.(scoreOptionSort, createAtOptionSort);
  }, []);
  // do no goi set state nen phai boc trong useEFFect
  return (
    <Box
      bg="#fff"
      style={{
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Table.ScrollContainer minWidth={800}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Username</Table.Th>
              <Table.Th>Avatar</Table.Th>
              <Table.Th>
                <Flex align="center" gap="sm">
                  Score
                  <SortTableIcon
                    asc={scoreOptionSort}
                    onClick={() => {
                      const next = toggleSort(scoreOptionSort);
                      onOptionSortChange(next, createAtOptionSort);
                    }}
                  />
                </Flex>
              </Table.Th>
              <Table.Th>
                <Flex align="center" gap="sm">
                  Created At
                  <SortTableIcon
                    asc={createAtOptionSort}
                    onClick={() => {
                      const next = toggleSort(createAtOptionSort);
                      onOptionSortChange(scoreOptionSort, next);
                    }}
                  />
                </Flex>
              </Table.Th>
              <Table.Th>Updated At</Table.Th>
              <Table.Th>Last Updated Score</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id} style={{ cursor: "pointer" }}>
                {/* ID */}
                <Table.Td>
                  <Link
                    href={PATH_ADMIN.users.detail(user.id)}
                    scroll={false}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    {user.id}
                  </Link>
                </Table.Td>

                {/* Username */}
                <Table.Td>
                  <Link
                    href={PATH_ADMIN.users.detail(user.id)}
                    scroll={false}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    {user.username}
                  </Link>
                </Table.Td>

                {/* Avatar */}
                <Table.Td>
                  <Link
                    href={PATH_ADMIN.users.detail(user.id)}
                    scroll={false}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    <Avatar
                      src={user.avatar_url}
                      alt="Avatar"
                      style={{ border: "2px solid #4C4C4C" }}
                    />
                  </Link>
                </Table.Td>

                {/* Score */}
                <Table.Td>
                  <Link
                    href={PATH_ADMIN.users.detail(user.id)}
                    scroll={false}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    {user.score}
                  </Link>
                </Table.Td>

                {/* Created At */}
                <Table.Td>
                  <Link
                    href={PATH_ADMIN.users.detail(user.id)}
                    scroll={false}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    {user.created_at}
                  </Link>
                </Table.Td>

                {/* Updated At */}
                <Table.Td>
                  <Link
                    href={PATH_ADMIN.users.detail(user.id)}
                    scroll={false}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    {user.updated_at}
                  </Link>
                </Table.Td>

                {/* Last Updated Score */}
                <Table.Td>
                  <Link
                    href={PATH_ADMIN.users.detail(user.id)}
                    scroll={false}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    {user.last_updated_score}
                  </Link>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  );
}
