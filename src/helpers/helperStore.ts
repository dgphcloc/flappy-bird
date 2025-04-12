const generateUserEmailTemp = (): string => {
  const timestamp = Date.now();
  const email = `$user_${timestamp}@flappybird.com`;
  return email;
};

export { generateUserEmailTemp };
