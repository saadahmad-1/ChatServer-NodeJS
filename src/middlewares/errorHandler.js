import responses from "../constants/responses.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ...responses["101"](), data: [] });
};