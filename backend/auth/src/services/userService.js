const User = require('../database/models/User');
const Role = require('../database/models/Role');
const TrainerStudentLink = require('../database/models/TrainerStudentLink');
const TrainerLinkCode =require("../database/models/TrainerLinkCode")

// Obtener todos los usuarios (sin contraseñas)
const getAllUsers = async () => {
    return await User.find().select('-password');
};

// Obtener un usuario por ID, con rol y relaciones si aplica
const getUserById = async (id) => {
    // Traer el usuario sin contraseña
    const userDoc = await User.findById(id).select('-password');
    if (!userDoc) return null;
  
    const roleDoc = await Role.findOne({ userId: id });
    const isTrainer = roleDoc?.role === 'trainer';
  
    let links = [];
  
    if (isTrainer) {
      links = await TrainerStudentLink.find({ trainerId: id })
        .populate('studentId', 'firstName lastName email') // 👈 trae datos del alumno
        .exec();
    } else {
      links = await TrainerStudentLink.find({ studentId: id })
        .populate('trainerId', 'firstName lastName email') // 👈 trae datos del entrenador
        .exec();
    }
    let linkCode = null;
    if (isTrainer) {
      const linkDoc = await TrainerLinkCode.findOne({ trainerId: id });
      linkCode = linkDoc?.linkCode || null;
    }
  
    return {
      ...userDoc.toObject(),
      role: roleDoc?.role || 'user',
      links: links.map(l => {
        const linkedUser = isTrainer ? l.studentId : l.trainerId;
        return {
          _id: linkedUser._id,
          firstName: linkedUser.firstName,
          lastName: linkedUser.lastName,
          email: linkedUser.email,
        };
      }),
      ...(isTrainer ? { linkCode } : {})
    };
  };
  


// Obtener usuario por email
const getUserByEmail = async (email) => {
    const user = await User.findOne({ email }).select('-password');
    if (!user) return null;

    const role = await Role.findOne({ userId: user._id });

    return {
        ...user.toObject(),
        role: role?.role || 'user'
    };
};

// Actualizar un usuario
const updateUser = async (id, userData) => {
    const updated = await User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
    return updated;
};

// Eliminar un usuario
const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
};
