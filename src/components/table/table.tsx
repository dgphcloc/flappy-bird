import { Table} from '@mantine/core';
import type { TableData } from '@mantine/core';
import { Box } from '@mantine/core';


export type TableDataRequired = Omit<Required<TableData>,'foot'|'caption'>
type TableMantineProps  =  {
    data:TableDataRequired
};

export default function TableMantine({ data }: TableMantineProps) {
 return (
    <Box bg="#fff" style={{
        backgroundColor: '#fff',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
      <Table data={data} />
    </Box>
  );
}
