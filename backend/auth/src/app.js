const express = require('express');
const connectDB = require('./database/db');
const mainRoute = require('./routes/mainRoute');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const { errorHandler } = require('./middlewares/errorMiddleware');




const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
// Configurar trust proxy si estás detrás de un proxy
app.set('trust proxy', true);

// Conectar a MongoDB y luego iniciar el servidor
connectDB().then(() => {
    app.use('/api', mainRoute);
    app.use(errorHandler);
    
    app.get('/', (req, res) => {
        res.send('Gym Auth API is running');
      });
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
});