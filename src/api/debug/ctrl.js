export const get = async (ctx) => {
  try {
    ctx.body = "debug";
  } catch (e) {
    ctx.throw(400);
  }
};
