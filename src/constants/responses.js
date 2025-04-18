const responses = {
  0: (message = "Success") => ({ responseCode: 0, message, success: true }),
  1: (message = "Resource Not Found") => ({
    responseCode: 1,
    message,
    success: false,
  }),
  100: (message = "Invalid parameters") => ({
    responseCode: 100,
    message,
    success: false,
  }),
  101: (message = "Internal Server Error") => ({
    responseCode: 101,
    message,
    success: false,
  }),
  102: (message = "Authorization Error") => ({
    responseCode: 102,
    message,
    success: false,
  }),
};

export default responses;
