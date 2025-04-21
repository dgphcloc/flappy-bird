import { getProfileRank } from "@/app/shared/_action";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";

export async function POST(request: Request) {
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
    if (score <= me.score) {
      return new Response(
        JSON.stringify({ error: `New score must be greater than old score` }),
        {
          status: 500,
        }
      );
    }

    /**
     * Update score
     */
    const supabase = createSupabaseAdminAuthClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        score: score,
      })
      .eq("id", me.profile_id);

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
