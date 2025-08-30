export const errorHandler = (err, req, res, next) => {
    console.error('Error', err.message);

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.name || "Server Error",
        message: err.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
}