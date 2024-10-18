const Moment = require("moment");
const { extendMoment } = require("moment-range");

const moment = extendMoment(Moment);

/**
 * @private
 */
const getDateRangeChunks = (startDate, endDate, chunkInDays) => {
  const range = moment.range(startDate, endDate);
  const chunks = Array.from(range.by("days", { step: chunkInDays }));
  const dateRanges = [];
  for (let i = 0; i < chunks.length; i++) {
    dateRanges.push({
      start:
        i > 0
          ? chunks[i].add(1, "day").format("DD-MM-YYYY")
          : chunks[i].format("DD-MM-YYYY"),
      end: chunks[i + 1]
        ? chunks[i + 1].format("DD-MM-YYYY")
        : range.end.format("DD-MM-YYYY"),
    });
  }
  return dateRanges;
};

/**
 * @private
 */
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

/**
 * @private
 * @param obj
 * @returns
 */
const getDataSchema = (data, isTypeStrict = true) => {
  if (typeof data !== "object") return isTypeStrict ? `${typeof data}` : "any";

  if (Array.isArray(data) && typeof data[0] !== "object") {
    return isTypeStrict ? `${typeof data[0]}[]` : "any";
  }

  return Object.entries(data).map(([key, value]) => {
    if (Moment.isDate(value)) return `${key}: ${isTypeStrict ? "Date" : "any"}`;

    if (value === null || typeof value === "string") {
      return `${key}: ${isTypeStrict ? "string | null" : "any"}`;
    }

    if (typeof value !== "string" && Array.isArray(value)) {
      const typeForEmpty = isTypeStrict ? [] : "any";
      return {
        [`${key}`]: value.length
          ? getDataSchema(value[0], isTypeStrict)
          : typeForEmpty,
      };
    }

    if (typeof value === "object") {
      return {
        [`${key}`]: getDataSchema(value, isTypeStrict),
      };
    }

    return `${key}: ${isTypeStrict ? typeof value : "any"}`;
  });
};

module.exports = {
  getDateRangeChunks,
  sleep,
  getDataSchema,
};
