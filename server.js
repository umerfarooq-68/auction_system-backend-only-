const express = require('express');
const sequelize = require('./config/sequelizeconfig');
const fileRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api/files', fileRoutes);
app.use('/files', fileRoutes);
sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        return sequelize.sync();
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
