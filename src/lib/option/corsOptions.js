export const getCorsOptions = (isProduction) => {
  if (isProduction)
    return {
      origin: "https://growthtopia.net",
      credentials: true,
    };
  else
    return {
      origin: "http://localhost:3000",
      credentials: true,
    };
};
