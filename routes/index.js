const testRoutes = require('./testingRoutes');
const authRoutes = require('./authenticationRoutes');
const errorController = require('../controllers/errorController');
const userRoutes = require('./userRoutes');
const walletRoutes = require('./walletRoutes');
const cardRoutes = require('./cardRoutes');
const depositRoutes = require('./depositRoutes');
const atmRoutes = require('./atmRoutes');
const bankRoutes = require('./bankRoutes');

module.exports = (app) => {
    app.use('/test', testRoutes);
    app.use('/auth', authRoutes);
    app.use('/user', userRoutes);
    app.use('/wallet', walletRoutes);
    app.use('/card', cardRoutes);
    app.use('/deposit', depositRoutes);
    app.use('/atm', atmRoutes);
    app.use('/bank', bankRoutes);
    
    app.use(errorController.handle_404_requests);
}