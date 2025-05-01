const mongoose = require('mongoose');
const Category = require('../database/models/Category'); // ajustá el path si hace falta
const dotenv = require('dotenv');
dotenv.config();

const categories = [
  { name: "Pecho", description: "Ejercicios que trabajan el pectoral mayor y menor.", icon: "Shirt" },
  { name: "Espalda", description: "Ejercicios para dorsales, trapecios y romboides.", icon: "Barbell" },
  { name: "Piernas", description: "Ejercicios que involucran cuádriceps, isquiotibiales y glúteos.", icon: "Footprints" },
  { name: "Hombros", description: "Ejercicios para deltoides y manguito rotador.", icon: "Dumbbell" },
  { name: "Biceps", description: "Ejercicios de flexión del codo.", icon: "Armchair" },
  { name: "Triceps", description: "Ejercicios de extensión del codo.", icon: "Armchair" },
  { name: "Core", description: "Ejercicios para abdomen, oblicuos y zona media.", icon: "HeartPulse" },
  { name: "Cardio", description: "Ejercicios aeróbicos que elevan la frecuencia cardíaca.", icon: "Activity" },
  { name: "Full Body", description: "Ejercicios que trabajan todo el cuerpo.", icon: "Infinity" },
  { name: "Movilidad", description: "Ejercicios para mejorar el rango de movimiento.", icon: "Move3D" },
  { name: "Rehabilitación", description: "Ejercicios controlados para recuperar lesiones.", icon: "FirstAidKit" },
  { name: "Otros", description: "Ejercicios no clasificados en las categorías anteriores.", icon: "HelpCircle" }
]


const seedCategories = async () => {
    console.log('DEBUG - MONGO_URI:', process.env.URI_MONGODB);
    try {
      await mongoose.connect(process.env.URI_MONGODB);
      console.log('✅ Conectado a la base de datos');
  
      for (const category of categories) {
        const exists = await Category.findOne({ name: category.name });
        if (!exists) {
          await Category.create(category);
          console.log(`➕ Agregada: ${category.name}`);
        } else {
          console.log(`🔁 Ya existe: ${category.name}`);
        }
      }
  
      console.log('🎉 Proceso completado');
      process.exit();
    } catch (err) {
      console.error('❌ Error al insertar categorías:', err.message);
      process.exit(1);
    }
  };

seedCategories();
