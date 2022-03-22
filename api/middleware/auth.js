const authMiddleware = async (req, resp, next) => {
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization !== process.env.API_TOKEN) {
        return resp.status(403).json({ message: 'Missing Authorization Header' });
    }

    next()
}

module.exports = authMiddleware