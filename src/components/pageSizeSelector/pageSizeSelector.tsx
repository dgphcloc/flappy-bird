import { Select } from '@mantine/core';

export default function PageSizeSelector({
  value,
  onChange,
  data = ['10', '15', '20', '30'],
}: {
  value: string;
  onChange: (value: string | null) => void;
  data?: string[];
}) {
  return (
    <Select
      data={data}
      value={value}
      onChange={onChange}
      allowDeselect={false}
      mt="md"
      w={80}
    />
  );
}
