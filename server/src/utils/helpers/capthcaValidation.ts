export const verifyRecaptcha = async (token: string) => {
  const secretKey = process.env.SECRET_KEY;
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
  );
  const result = await response.json();
  return result.success;
};