import moment from "moment";

export const getDateRange = (query) => {
  switch (query) {
    case query === "30days":
      return { startDate: moment().subtract(30, "days"), endDate: moment() };

    case query !== "30days" || "3months":
      return {
        startDate: moment().startOf(query),
        endDate: moment().endOf(query),
      };

    default:
      return { startDate: moment().subtract(3, "months"), endDate: moment() };
  }
};
