import { getCurrentUserProfile } from "@/app/shared/_action";

export async function GET() {
  const user = await getCurrentUserProfile();

  return new Response(JSON.stringify({ user }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
