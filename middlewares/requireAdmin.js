const { ADMIN } = require('../config/contansts/userTypes');
module.exports = (req, res, next) => {
  if (req.user && req.user.user_type_id === ADMIN) {
    return next();
  }
  return res.status(403).json({ message: `${ADMIN} Acceso denegado: solo administradores. ${req.user.phone}` });
};
