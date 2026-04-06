export const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                statusCode: 403,
                errorMessage: 'Forbidden: You do not have permission to perform this action',
                err: null
            });
        }
        next();
    };
};
