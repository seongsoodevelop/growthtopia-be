export const getRandom6DigitsCode = () => {
  let code = "";
  for (let i = 0; i < 6; i++) {
    let x = Math.floor(Math.random() * 36);
    if (x <= 9) code += `${x}`;
    else code += `${String.fromCharCode(x + 55)}`;
  }

  return code;
};
