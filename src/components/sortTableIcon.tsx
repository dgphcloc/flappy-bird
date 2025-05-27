"use client";

import { useState } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { sortOption } from "./table/table";

type SortTableIconProp = {
  asc?: sortOption;
  onClick?: () => void;
};
export default function SortTableIcon({ asc, onClick }: SortTableIconProp) {
  const [isAscending, setIsAscending] = useState(asc == "ASC" ? true : false);
  const toggleSort = () => {
    setIsAscending((prev) => !prev);
    onClick?.();
  };

  return (
    <span onClick={toggleSort} style={{ cursor: "pointer" }}>
      {isAscending ? (
        <AiOutlineArrowUp color="#1098AD" size={16} />
      ) : (
        <AiOutlineArrowDown color="#FF0033" size={16} />
      )}
    </span>
  );
}
