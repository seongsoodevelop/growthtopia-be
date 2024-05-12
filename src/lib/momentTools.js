import moment from "moment";

export const getStandardDate = (date) => {
  const t = moment(date);
  if (t.hours() < 4) {
    t.subtract(1, "days");
  }

  return t.format("YYYY-MM-DD 04:00:00");
};
