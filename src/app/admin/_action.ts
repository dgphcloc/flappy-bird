import createSupabaseAdminAuthClient from "@/lib/supabase/admin";
import { UserRecord } from "@/type/type";
export type PaginatedUserResult = {
  data: UserRecord[];
  total: number;
};

export async function fetchUsersByPage(page:number,perPage = 15): Promise<PaginatedUserResult| null>{
    console.log('fetch user trang',page)
    const supabase = await createSupabaseAdminAuthClient();
  const from:number = (page - 1) * perPage;
  const to :number = from + perPage - 1;

  const { data,count, error } = await supabase
  .from('UserProfile')
  .select('*',{ count: "exact" })
  .range(from,to);
  console.log(`co tong ${count} record`)
  if (error) {
    console.error("Lỗi:", error);
    return null;
  } else {
    return {
      data: data as UserRecord[],
      total: count ?? 0,
    }
  }
}