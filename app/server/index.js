const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const helpers = require('./util/helpers');
const webpack = require('webpack');
const webpackConfig = require('../../webpack.config');
const compiler = webpack(webpackConfig);

//Route Name
const userRouter = require('./routes/user');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../../public');
const devMode = process.env.NODE_ENV !== 'production';

// Middlewares
if (devMode) {
    app.use(
        require('webpack-dev-middleware')(compiler, {
            noInfo: true,
            writeToDisk: true,
            publicPath: webpackConfig.output.publicPath,
        }),
    );
    app.use(require('webpack-hot-middleware')(compiler));
}
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes for panel
app.use('/api/user', userRouter);

app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    else res.sendFile(path.resolve(publicPath, 'index.html'));
});

app.use((req, res, next) => {
    next(createError(404));
});
app.use((err, req, res, next) => {
    console.log('err.status :', err.status);
    res.status(500).json({
        status: err.status || 500,
        message: 'An error has ocurred.',
        data: process.env.PROD ? undefined : err,
    });
});

helpers.initApp();
server.listen(port);
server.on('listening', () => console.log('Listening on Port: ' + port));
server.on('error', e => console.log('Error runing server = ', e));
