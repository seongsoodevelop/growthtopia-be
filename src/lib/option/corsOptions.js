export const getCorsOptions = (isProduction) => {
  if (isProduction)
    return {
      origin: "https://api.growthtopia.net",
      credentials: true,
    };
  else
    return {
      origin: "http://localhost:3000",
      credentials: true,
    };
};
