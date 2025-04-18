import { getTopHighestPlayer } from "@/app/shared/_action";

export async function GET() {
  try {
    const player = await getTopHighestPlayer(3);

    if (!player) {
      return new Response(JSON.stringify({ error: "No players found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(player), {
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
