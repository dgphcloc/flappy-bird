type PaginationInfoBarProps = {
  totalItem: number;
  currentPage: number;
  perPage: number;
};

export default function PaginationInfoLabel({
  totalItem,
  currentPage,
  perPage,
}: PaginationInfoBarProps) {
  const start = Math.min((currentPage - 1) * perPage + 1, totalItem);
  const end = Math.min(currentPage * perPage, totalItem);

  return (
    <div>
      {start} - {end} / {totalItem}
    </div>
  );
}
