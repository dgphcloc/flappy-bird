const generateUserEmailTemp = (): string => {
  const randomString = Math.random().toString(36).substring(2, 8);
  const email = `user_${randomString}@flappybird.vn`;
  console.log("Generated email:", email);
  return email;
};

export { generateUserEmailTemp };
