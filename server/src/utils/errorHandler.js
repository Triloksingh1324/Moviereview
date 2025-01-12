const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        success: err.success,
        message: err.message,
        errors: err.errors || [],
      });
    }
  
    // Handle unexpected errors
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: [],
    });
  };
  
  export default errorHandler;
  