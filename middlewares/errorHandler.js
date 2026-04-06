export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        statusCode,
        errorMessage: message,
        err: process.env.NODE_ENV === 'development' ? err : {}
    });
};
