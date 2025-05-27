"use server";

import { HistoryEntry } from "@/components/HistoryGame";
import { sortOption } from "@/components/table/table";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";
import { UserRecord } from "@/type/type";

export type PaginatedResult<T> = {
  data: T[];
  total: number;
};

type PaginatedQueryOptions<T> = {
  tableName: string;
  page: number;
  perPage?: number;
  query?: string;
  dateFrom?: string;
  dateTo?: string;
  searchColumns?: (keyof T)[];
  abortSignal?: AbortSignal;
  scoreOptionSort?: sortOption;
  createdAtOptionSort?: sortOption;
  eqOption?: {
    col: string;
    value: string | number;
  };
};

const getPaginationRange = (page: number, perPage: number) => ({
  from: (page - 1) * perPage,
  to: (page - 1) * perPage + perPage - 1,
});

export async function fetchPaginatedRecords<T>({
  tableName,
  page = 1,
  perPage = 15,
  query = "",
  searchColumns = [],
  scoreOptionSort,
  dateFrom,
  dateTo,
  createdAtOptionSort,
  abortSignal,
  eqOption,
}: PaginatedQueryOptions<T>): Promise<PaginatedResult<T> | null> {
  try {
    const supabase = await createSupabaseAdminAuthClient();
    const { from, to } = getPaginationRange(page, perPage);

    let queryBuilder = supabase
      .from(tableName)
      .select("*", { count: "exact" })
      .range(from, to);

    if (eqOption) {
      queryBuilder.eq(eqOption.col, eqOption.value);
    }
    if (scoreOptionSort) {
      queryBuilder = queryBuilder.order("score", {
        ascending: scoreOptionSort === "ASC",
      });
    }

    if (createdAtOptionSort) {
      queryBuilder = queryBuilder.order("created_at", {
        ascending: createdAtOptionSort === "ASC",
      });
    }
    if (dateFrom) {
      queryBuilder = queryBuilder.gte("updated_at", dateFrom);
    }

    if (dateTo) {
      queryBuilder = queryBuilder.lte("updated_at", dateTo);
    }

    if (query && searchColumns.length > 0) {
      const searchPattern = `%${query}%`;
      const orConditions = searchColumns
        .map((column) => `${String(column)}.ilike.${searchPattern}`)
        .join(",");

      queryBuilder = queryBuilder.or(orConditions);
    }
    if (abortSignal) {
      queryBuilder = queryBuilder.abortSignal(abortSignal);
    }
    const { data, count, error } = await queryBuilder;
    console.log("FETCH", data, count, error, dateFrom, dateTo);
    if (error) throw error;

    return {
      data: data as T[],
      total: count ?? 0,
    };
  } catch (error) {
    console.error("Failed to fetch paginated records:", error);
    return null;
  }
}

export async function fetchUsersByPage(
  page: number,
  perPage = 15,
  query = "",
  scoreOptionSort?: sortOption,
  createdAtOptionSort?: sortOption
): Promise<PaginatedResult<UserRecord> | null> {
  return fetchPaginatedRecords<UserRecord>({
    tableName: "UserProfile",
    page,
    perPage,
    searchColumns: ["username" as keyof UserRecord],
    query: query,
    scoreOptionSort,
    createdAtOptionSort,
  });
}

export async function fetchHistoryByPage(
  page: number,
  perPage = 15,
  dateFrom: string,
  dateTo: string,
  eqOption?: {
    col: string;
    value: string | number;
  }
): Promise<PaginatedResult<HistoryEntry> | null> {
  return fetchPaginatedRecords<HistoryEntry>({
    tableName: "user_histories",
    page,
    perPage,
    dateFrom,
    dateTo,
    eqOption,
  });
}

export async function fetchUserById(id: string): Promise<UserRecord | null> {
  try {
    const supabase = await createSupabaseAdminAuthClient();

    const { data, error } = await supabase
      .from("UserProfile")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data as UserRecord;
  } catch (error) {
    console.error("Failed to fetch user by ID:", error);
    return null;
  }
}
