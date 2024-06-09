const parseValidationErrors = (e, req) => {
    const keys = Object.keys(e.errors);
    keys.forEach((key) => {
        req.flash("error", key + ": " + e.errors[key].properties.message);
    });
};

const handleErrors = (error, req, res, redirectPath = '/students') => {
    if (error.name === 'ValidationError') {
        const errors = parseValidationErrors(error);
        req.flash('error', errors);
        res.redirect(redirectPath);
    } else {
        res.status(500);
        req.flash('error', 'An internal server error occurred.');
        res.redirect(redirectPath);
    }
};

module.exports = handleErrors;