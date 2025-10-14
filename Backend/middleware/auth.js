// Simple auth middleware (you can expand this later with JWT)
export const protect = (req, res, next) => {
    // For now, just a placeholder
    // You can add JWT verification here later
    next();
};

export const admin = (req, res, next) => {
    // Check if user is admin
    // For now, just a placeholder
    next();
};