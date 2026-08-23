const createError = (statusCode, message, errors = []) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
};

const badRequest = (message = "Bad Request", errors = []) => {
  return createError(400, message, errors);
};

const unauthorized = (message = "Unauthorized", errors = []) => {
  return createError(401, message, errors);
};

const forbidden = (message = "Forbidden", errors = []) => {
  return createError(403, message, errors);
};

const notFound = (message = "Not Found", errors = []) => {
  return createError(404, message, errors);
};

const conflict = (message = "Conflict", errors = []) => {
  return createError(409, message, errors);
};

module.exports = {
  createError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
};
