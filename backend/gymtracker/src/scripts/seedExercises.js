const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exercise = require('../database/models/Exercise'); // Ajustá el path
const Category = require('../database/models/Category'); // Ajustá el path

dotenv.config();

const exercisesByCategory = {
  Pecho: [
    'Press banca',
    'Press inclinado con barra',
    'Press declinado con mancuernas',
    'Aperturas con mancuernas',
    'Fondos en paralelas (pecho)',
    'Press en máquina',
  ],
  Espalda: [
    'Dominadas',
    'Remo con barra',
    'Remo con mancuernas',
    'Jalón al pecho en polea',
    'Jalón tras nuca',
    'Peso muerto',
  ],
  Piernas: [
    'Sentadillas',
    'Prensa de piernas',
    'Estocadas',
    'Peso muerto rumano',
    'Curl femoral',
    'Extensión de piernas',
    'Elevación de talones (gemelos)',
  ],
  Hombros: [
    'Press militar',
    'Elevaciones laterales',
    'Elevaciones frontales',
    'Vuelos posteriores',
    'Encogimientos de hombros',
    'Press Arnold',
  ],
  Biceps: [
    'Curl con barra',
    'Curl con mancuernas',
    'Curl inclinado',
    'Curl martillo',
    'Curl concentrado',
  ],
  Triceps: [
    'Fondos (tríceps)',
    'Extensión en polea',
    'Press francés',
    'Patada de tríceps',
    'Rompecráneos',
  ],
  Core: [
    'Abdominales crunch',
    'Elevación de piernas',
    'Plancha',
    'Plancha lateral',
    'Bicicleta abdominal',
    'Rueda abdominal',
  ],
  Cardio: [
    'Cinta',
    'Bicicleta fija',
    'Elíptico',
    'Remo',
    'Soga',
    'Escaladores',
    'Burpees',
  ],
  'Full Body': [
    'Burpees',
    'Sentadilla con press',
    'Kettlebell swing',
    'Thruster',
    'Clean and press',
    'Saltos con separación',
  ],
  Movilidad: [
    'Estiramiento dinámico de cadera',
    'Círculos de hombros',
    'Rotaciones de columna',
    'Flexión de cadera',
    'Movilidad torácica',
    'Estiramiento de tobillo',
  ],
  Rehabilitación: [
    'Rotación externa con banda',
    'Elevación frontal con banda',
    'Isométrico de cuádriceps',
    'Marcha en el lugar',
    'Abducción de cadera',
    'Elevación de talones sentado',
  ],
  Otros: [
    'Escalera de agilidad',
    'BOSU',
    'Trineo (sled)',
    'Sogas (battle ropes)',
    'Balón medicinal',
  ],
};

const seedExercises = async () => {
  console.log('DEBUG - MONGO_URI:', process.env.URI_MONGODB);
  try {
    await mongoose.connect(process.env.URI_MONGODB);
    console.log('✅ Conectado a la base de datos');

    for (const [categoryName, exercises] of Object.entries(exercisesByCategory)) {
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        console.warn(`⚠️ Categoría no encontrada: ${categoryName}`);
        continue;
      }

      for (const name of exercises) {
        const exists = await Exercise.findOne({ name, category: category._id });
        if (!exists) {
          await Exercise.create({
            name,
            category: category._id
          });
          console.log(`➕ Agregado: ${name} (${categoryName})`);
        } else {
          console.log(`🔁 Ya existe: ${name} (${categoryName})`);
        }
      }
    }

    console.log('🎉 Seeding de ejercicios completo');
    process.exit();
  } catch (err) {
    console.error('❌ Error al insertar ejercicios:', err.message);
    process.exit(1);
  }
};

seedExercises();
