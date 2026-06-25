const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const puerto = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));

const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database: 'pruebita'
});

conexion.connect(error => {
    if (error){
        console.error("Error al conectar con la base de datos: ", error);
    } else {
        console.log("Datos guardados en la base de datos.");
    }
});

app.post('/enviar', (req, res) => {
    console.log("Nueva petición");
    console.log("Recibidou (req.body):", req.body);

    const {nombre, email, password, confirm_password} = req.body;
    console.log("Datos recibidos:", {nombre, email,password,confirm_password});

    const sql = 'INSERT INTO datitos (nombre, email, password, confirm_password) VALUES (?, ?, ?, ?)';
    conexion.query(sql, [nombre, email, password, confirm_password], (error, resultados) => 
    {
        if (error){
            console.error('Error al enviar a la DB: ', error);
            res.status(500).send('Error del server :C');
        } else {
            console.log('Datos guardados en la DB :D');
            res.status(200).send('Datos bien recibidos y guardados.');
        }
    });
});

app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
})