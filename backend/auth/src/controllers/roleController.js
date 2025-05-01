const roleService = require('../services/roleService');

/**
 * Asigna o actualiza el rol de un usuario en una empresa.
 * Se espera que en el body se envíen: userId y role.
 */
const assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) {
      return res.status(400).json({ success: false, message: 'Se requieren userId y role.' });
    }
    const updatedRole = await roleService.assignOrUpdateRoleForUser(userId, role);
    res.status(200).json({ success: true, role: updatedRole });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtiene los roles asignados a un usuario.
 * Se espera que el parámetro de ruta sea el userId.
 */
const getRolesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'El userId es requerido.' });
    }
    const roles = await roleService.getRolesByUserId(userId);
    res.status(200).json({ success: true, roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  assignRole,
  getRolesByUserId,
};
