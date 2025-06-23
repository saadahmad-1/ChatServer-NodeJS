import responses from "../constants/responses.js";

export const validate = (schema, type = "Body") => {
  return (req, res, next) => {
    const data = req[type];

    const validation = schema.validate(data, { abortEarly: false });

    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      return res.status(400).json({ ...responses["100"](), error: errors });
    }
    next();
  };
};
