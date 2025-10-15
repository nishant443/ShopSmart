// Simple auth middleware (you can expand this later with JWT)
// Lightweight demo auth middleware
// This accepts an Authorization header of the form:
//   Authorization: Bearer demo:<base64-email>
// It decodes the email and attaches a `user` object to req.
// This is intentionally simple so the frontend can create a token
// on login/register without a full server-side user system.
export const protect = (req, res, next) => {
    try {
        const auth = req.headers.authorization || req.headers.Authorization || req.headers['x-authorization'];
        if (!auth) {
            return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
        }

        const parts = auth.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ success: false, message: 'Malformed authorization header' });
        }

        const token = parts[1];

        // Demo token format: demo:<base64Email>
        if (token.startsWith('demo:')) {
            const b64 = token.slice('demo:'.length);
            try {
                const email = Buffer.from(b64, 'base64').toString('utf8');
                // attach minimal user info
                req.user = { email };
                return next();
            } catch (err) {
                return res.status(401).json({ success: false, message: 'Invalid demo token' });
            }
        }

        // If you later add real JWTs, verify them here.
        return res.status(401).json({ success: false, message: 'Unsupported token type' });
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ success: false, message: 'Auth middleware failure' });
    }
};

// Admin guard - checks that the authenticated user's email matches ADMIN_EMAIL
export const admin = (req, res, next) => {
    if (!req.user || !req.user.email) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && req.user.email === adminEmail) {
        return next();
    }

    return res.status(403).json({ success: false, message: 'Admin access required' });
};