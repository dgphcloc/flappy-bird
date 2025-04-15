import { Table } from "@mantine/core";
import type { TableData } from "@mantine/core";
import { Box, Avatar } from "@mantine/core";
import { useRouter } from "next/navigation";

export type TableDataRequired = Omit<Required<TableData>, "foot" | "caption">;
type TableMantineProps = {
  data: TableDataRequired;
};

export default function TableMantine({ data }: TableMantineProps) {
  const router = useRouter();

  return (
    <Box
      bg="#fff"
      style={{
        backgroundColor: "#fff",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {data.head.map((header, index) => (
              <Table.Th key={index}>{header}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.body.map((row, rowIndex) => (
            <Table.Tr
              key={rowIndex}
              style={{ cursor: "pointer" }}
              onClick={() => {
                const userId = row.at(0);
                if (typeof userId === "string" || typeof userId === "number") {
                  router.push(`/admin/users/${userId}`);
                }
              }}
            >
              {row.map((cell, cellIndex) => {
                const isImage =
                  typeof cell === "string" &&
                  (cell.startsWith("http://") || cell.startsWith("https://"));

                return (
                  <Table.Td key={cellIndex}>
                    {isImage ? (
                      <Avatar
                        src={cell}
                        alt="image"
                        style={{ border: "2px solid #4C4C4C" }}
                      />
                    ) : (
                      cell
                    )}
                  </Table.Td>
                );
              })}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
