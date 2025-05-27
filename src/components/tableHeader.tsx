import { Table } from "@mantine/core";
import { memo } from "react";

function TableHeader({ name }: { name: string }) {
  return <Table.Th>{name}</Table.Th>;
}

export default memo(TableHeader);
