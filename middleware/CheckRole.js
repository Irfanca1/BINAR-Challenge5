exports.isAdmin = (req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "superadmin") {
        next();
    } else {
        res.status(403).json({ status: false, message: "You are not authorized to perform this action" });
    }
};
exports.isMember = (req, res, next) => {
    if (req.user.role === "member") {
        next();
    } else {
        res.status(403).json({ status: false, message: "You are not authorized to perform this action" });
    }
};
exports.isSuperAdmin = (req, res, next) => {
    if (req.user.role === "superadmin") {
        next();
    } else {
        res.status(403).json({ status: false, message: "You are not authorized to perform this action" });
    }
};
