export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
    });

    if (!result.success) {
        return res.status(400).json({
            statusCode: 400,
            errorMessage: 'Validation failed',
            err: result.error.errors ? result.error.errors.map(err => ({
                path: err.path,
                message: err.message
            })) : result.error.message
        });
    }

    next();
};
