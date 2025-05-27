import { getProfileRank } from "@/app/shared/_action";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";

export async function POST(request: Request) {
  console.log("CHAY VAO ROUTE UPDATE SCORE");
  try {
    const body = await request.json();
    const { score } = body;

    if (typeof score !== "number") {
      return new Response(JSON.stringify({ error: "Score must be a number" }), {
        status: 400,
      });
    }

    const result = await getProfileRank();
    if (!result) {
      /**
       *  if no user
       */
      return new Response(JSON.stringify({ error: `Invalid user` }), {
        status: 500,
      });
    }
    const me = result.at(0);
    console.log("ME", me);
    /**
     * Update score
     */
    const supabase = createSupabaseAdminAuthClient();
    const { data, error } = await supabase.from("user_histories").insert({
      user_id: me.profile_id,
      score: score,
    });
    console.log(
      "CAP NHAT HISTORY THANH CONG",
      data,
      error,
      me.profile_id,
      score
    );

    if (score > me.score) {
      await supabase
        .from("profiles")
        .update({
          score: score,
        })
        .eq("id", me.profile_id);
      console.log("CAP NHAT PROFILE THANH CONG");
    }
    if (error) {
      return new Response(
        JSON.stringify({
          message: `Score updated failure`,
          data,
          error,
        }),
        {
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: `Score updated successfully`,
      }),
      {
        status: 200,
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: `Invalid request: ${e}` }), {
      status: 500,
    });
  }
}
