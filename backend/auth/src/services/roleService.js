const Role = require('../database/models/Role');

/**
 * Obtiene todos los roles asignados a un usuario (en distintas empresas, si aplica).
 * @param {String} userId - UUID del usuario.
 * @returns {Promise<Array>} Lista de roles asignados al usuario.
 */
const getRolesByUserId = async (userId) => {
  // Si el usuario puede tener varios roles en diferentes empresas, usamos find()
  const roles = await Role.find({ userId });
  return roles;
};

/**
 * Asigna o actualiza el rol de un usuario en una empresa.
 * Si ya existe un registro para ese userId  se actualiza el rol;
 * de lo contrario, se crea uno nuevo.
 * @param {String} userId - UUID del usuario.
 * @param {String} roleName - Nombre del rol a asignar.
 * @returns {Promise<Object>} Objeto con la asignación de rol actualizada o creada.
 */
const assignOrUpdateRoleForUser = async (userId, roleName) => {
  const existingRole = await Role.findOne({ userId  });
  if (existingRole) {
    existingRole.role = roleName;
    await existingRole.save();
    return existingRole;
  }
  const newRole = new Role({ userId, role: roleName });
  await newRole.save();
  return newRole;
};

module.exports = {
  getRolesByUserId,
  assignOrUpdateRoleForUser
};
