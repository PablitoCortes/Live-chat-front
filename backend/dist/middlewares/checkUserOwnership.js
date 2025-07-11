"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserOwnership = void 0;
const checkUserOwnership = (req, res, next) => {
    var _a;
    try {
        const requestedUserId = req.params.userId;
        const loggedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (requestedUserId !== loggedUserId) {
            res.status(403).json({
                message: "No tienes permiso para acceder a este recurso",
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            message: "Error al verificar permisos",
        });
        return;
    }
};
exports.checkUserOwnership = checkUserOwnership;
