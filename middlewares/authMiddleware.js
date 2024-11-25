const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const actualToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = decoded; 
        // console.log("\n\nreq.user:", JSON.stringify(req.user, null, 2));
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

