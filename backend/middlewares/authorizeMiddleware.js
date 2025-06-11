// Middleware to authorize users based on their roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user.role should be populated by your `protect` middleware
    if (!req.user || !req.user.role) {
      console.log("Authorize Middleware: User not authenticated or role not found for user ID:", req.user?.id);
      return res.status(403).json({ msg: "Not authorized: User role not found or not authenticated." });
    }

    // Clean user role by trimming whitespace
    const userRole = req.user.role.trim();

    // Determine the actual list of allowed roles
    let allowedRoles = roles;
    // If the first argument is an array (e.g., authorize(['admin', 'recruiter'])),
    // then use that array as the source of roles.
    if (roles.length === 1 && Array.isArray(roles[0])) {
      allowedRoles = roles[0];
    }
    
    // Clean allowed roles by trimming whitespace from each
    allowedRoles = allowedRoles.map(role => String(role).trim()); // Ensure 'role' is treated as a string

    // --- DEBUG LOGS START (Updated) ---
    console.log(`Authorize Middleware: Cleaned User role is '${userRole}'`);
    console.log(`Authorize Middleware: Cleaned Allowed roles are: ${allowedRoles.join(', ')}`);
    console.log(`Authorize Middleware: Does cleaned allowed roles include cleaned user role? ${allowedRoles.includes(userRole)}`);
    // --- DEBUG LOGS END ---

    // Check if the user's role is included in the allowed roles array
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ msg: `Not authorized: User role '${userRole}' is not permitted to access this resource.` });
    }

    next(); // User is authorized, proceed to the next middleware/controller
  };
};

module.exports = authorize;
