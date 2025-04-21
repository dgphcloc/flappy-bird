import { getProfileRank, getTopHighestPlayer } from "@/app/shared/_action";

export async function GET() {
  try {
    const topPlayers = await getTopHighestPlayer(3);
    const me = await getProfileRank();
    if (!topPlayers) {
      return new Response(JSON.stringify({ error: "No players found" }), {
        status: 404,
      });
    }
    topPlayers.data?.forEach((player, index) => {
      player.rank = index + 1;
    });
    return new Response(JSON.stringify({ topPlayers, me }), {
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
