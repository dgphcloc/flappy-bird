'use client'

import { Pagination } from '@mantine/core';
import { useState } from 'react';
type PaginationProp = {
    totalPage:number,
    onChangeFunc: (page: number) => void;
}
//chuyen no thanh generic de co the phan trang bat ki loai du lieu nao ko chi user
export default function PaginationMantine({data}:{data:PaginationProp}) {
  const [activePage, setPage] = useState<number>(1);
  const handlePaginate = (page:number) => {
    if (page < 1 || page > data.totalPage) return;
    setPage(page)
    data.onChangeFunc(page)
  }
  return <Pagination
      total={data.totalPage}
      value={activePage}
      onChange={handlePaginate}
    />
}