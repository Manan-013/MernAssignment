const validationMiddleware = (schema, source = "body") => {
  return (req, res, next) => {
    const dataToValidate = req[source] || {};

    const { value, error } = schema.validate(dataToValidate, {
      abortEarly: false, // validate all fields before returning errors
      stripUnknown: true, // strip out extra fields to prevent mass assignment bugs
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errorMessages,
      });
    }

    // Save the sanitized/converted value back to req (important for defaults and type conversion!)
    req[source] = value;
    next();
  };
};

module.exports = validationMiddleware;
