export const getCookieSecureOptions = (isProduction) => {
  if (isProduction) {
    return {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "Lax",
      secure: true,
    };
  } else {
    return {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    };
  }
};
