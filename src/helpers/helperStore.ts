
import getUserSession from "@/lib/supabase/getUserSession";

export const generateUserEmailTemp = (): string => {
  const timestamp = Date.now();
  const email = `$user_${timestamp}@flappybird.com`;
  return email;
};

export const isLogged = async () => !!(await getUserSession()).data.session;

export const isValidScore = (score: number | string): boolean => {
  const MAX_SCORE = 2_000_000_000;
  const MIN_SCORE = 0;

  const numericScore = typeof score === "string" ? parseFloat(score) : score;

  if (isNaN(numericScore)) return false;

  return numericScore >= MIN_SCORE && numericScore <= MAX_SCORE;
};
