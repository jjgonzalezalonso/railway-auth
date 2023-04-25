const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./routes/db/config.js');
const path = require('path');
// Crear el servidor/aplicación de express
require('dotenv').config();
console.log(process.env);

const app=express();
dbConnection();

app.use(express.static('public'));

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth.js'));
app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname,'public/index.html'));
})
app.listen(process.env.PORT,() => {
    console.log('Servidor corriendo en puerto 4000');
});




// app.get('/',(req,res) => {
//     res.json({
//         ok:true,
//         msg:'Todo salio bien',
//         uid:1234
//     })
// });