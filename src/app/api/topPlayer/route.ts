import { getProfileRank, getTopHighestPlayer } from "@/app/shared/_action";

export async function GET() {
  try {
    const toPlayers = await getTopHighestPlayer(3);
    const me = await getProfileRank();
    if (!toPlayers) {
      return new Response(JSON.stringify({ error: "No players found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ toPlayers, me }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: "Internal Server Error",
          details: error.message,
        }),
        { status: 500 }
      );
    } else {
      return new Response(
        JSON.stringify({
          error: "Internal Server Error",
          details: "Unknown error occurred",
        }),
        { status: 500 }
      );
    }
  }
}
