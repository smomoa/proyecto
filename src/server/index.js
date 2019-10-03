const express = require('express');
const cors = require('cors');
const app = express();
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))

app.use(cors());

app.get('/', (req, res) => {
	res.status(200).send({respuesta:'conectado'})
})

app.post('/login', (req, res) => {
	var nickName = req.body.nickName
	var password = req.body.password

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'prueba'
	});

	var query = connection.query('SELECT * FROM login WHERE password = ?', password, function (error, result) {
		if (error) {
			throw error;
		} else {
			if (result.length > 0) {
				var tokenData = {
					userName: nickName,
					password: password
				}

				var token = jwt.sign(tokenData, 'Diplodocus', {
					expiresIn: 60 * 60 * 24
				})

				res.send({
					token,
					perfil: 1,
					userName: 'Samuel Bustamante',
					avatar: 'https://i.imgur.com/NKgo7fn.png'
				})
			} else {
				res.status(400).send({ error: 'Usuario Incorrecto' })
			}
		}
	});
	connection.end();
})

app.get('/lista', (req, res) => {
	var token = req.headers['authorization']
	if (!token) {
		res.status(401).send({
			error: "Es necesario el token de autenticación"
		})
		return
	}

	token = token.replace('Bearer ', '')

	jwt.verify(token, 'Diplodocus', function (err, user) {
		if (err) {
			res.status(401).send({
				error: 'Token inválido'
			})
		} else {
			var connection = mysql.createConnection({
				host: 'localhost',
				user: 'root',
				password: '',
				database: 'prueba'
			});

			var query = connection.query('SELECT * FROM usuarios', function (error, rows) {
				if (error) {
					throw error;
				} else {
					res.status(200).send({ respuesta: rows })
				}
			});
			connection.end();
		}
	})
})

app.post('/insertar', (req, res) => {
	var nombre = req.body.nombre
	var apellido = req.body.apellido
	var edad = req.body.edad
	var cuerpo = [
		[nombre, apellido, edad]
	]
	var token = req.headers['authorization']

	if (!token) {
		res.status(401).send({
			error: "Es necesario el token de autenticación"
		})
		return
	}

	token = token.replace('Bearer ', '')

	jwt.verify(token, 'Diplodocus', function (err, user) {
		if (err) {
			res.status(401).send({
				error: 'Token inválido'
			})
		} else {
			var connection = mysql.createConnection({
				host: 'localhost',
				user: 'root',
				password: '',
				database: 'prueba'
			});

			var query = connection.query('INSERT INTO usuarios (nombre, apellido, edad) VALUES ?', [cuerpo], function (error, result) {
				if (error) {
					throw error;
				} else {
					res.status(200).send({ respuesta: result.affectedRows})
				}
			});
			connection.end();
		}
	})
})

app.listen(4000, () => console.log('Servidor esta activo en puerto 4000 xD'));