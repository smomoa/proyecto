import React, { Component } from 'react';
import { Col, FormGroup, Input, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			login: {},
			respuesta: {},
			abrir: false,
			abrirInsertar: false,
			lista: {},
			insertar: {},
			respuestaInsertar: {}
		};
		this.onChange = this.onChange.bind(this);
		this.onChangeInsertar = this.onChangeInsertar.bind(this)
	}

	login = async () => {
		await fetch(`http://localhost:4000/login`, {
			method: 'POST',
			body: JSON.stringify(this.state.login),
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			}
		}).then(respuesta => {
			return respuesta.json()
		}).then(json => {
			this.setState({
				respuesta: json
			})
			localStorage.setItem('Datos', JSON.stringify(this.state.respuesta))
		})
	}

	onChange = (e) => {
		this.setState({
			login: {
				...this.state.login,
				[e.target.name]: e.target.value
			}
		});
	}

	onChangeInsertar = (e) => {
		this.setState({
			insertar: {
				...this.state.insertar,
				[e.target.name]: e.target.value
			}
		})
	}

	modal() {
		this.setState({
			abrir: !this.state.abrir
		})
	}

	modal2() {
		this.setState({
			abrirInsertar: !this.state.abrirInsertar
		})
	}

	peticion = async () => {
		let usuarioDatos = JSON.parse(localStorage.getItem('Datos'))
		let token = usuarioDatos.token
		await fetch(`http://localhost:4000/lista`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			}
		}).then(respuesta => {
			return respuesta.json()
		}).then(json => {
			this.setState({
				lista: json,
				abrir: false
			})
		})
	}

	peticionInsertar = async () => {
		let usuarioDatos = JSON.parse(localStorage.getItem('Datos'))
		let token = usuarioDatos.token
		await fetch(`http://localhost:4000/insertar`, {
			method: 'POST',
			body: JSON.stringify(this.state.insertar),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				Authorization: `Bearer ${token}`
			}
		}).then(respuesta => {
			return respuesta.json()
		}).then(json => {
			this.setState({
				respuestaInsertar: json,
				abrirInsertar: false
			})
		})
	}

	render() {

		return (

			<div className='App'>
				<header className='App-header'>
					<div className="animated fadeIn">
						<Col xs="12">
							<Modal isOpen={this.state.abrir} toggle={this.modal.bind(this)} style={{ boxShadow: '0 12px 15px 0 #0000003d, 0 17px 50px 0 #00000030' }}>
								<ModalHeader toggle={this.modalOpen2} style={{ backgroundColor: '#C05959', color: 'white' }}>Solicitud</ModalHeader>
								<ModalBody>

								</ModalBody>
								<ModalFooter>
									<Button outline color="info" onClick={this.peticion.bind(this)}>Solicitar!</Button>{' '}
									<Button outline color="danger" onClick={this.modal.bind(this)}>Cancelar</Button>
								</ModalFooter>
							</Modal>
							<Modal isOpen={this.state.abrirInsertar} toggle={this.modal2.bind(this)} style={{ boxShadow: '0 12px 15px 0 #0000003d, 0 17px 50px 0 #00000030' }}>
								<ModalHeader toggle={this.modalOpen2} style={{ backgroundColor: '#CC5EF5', color: 'white' }}>Insertar</ModalHeader>
								<ModalBody>
									<Input type='text' name='nombre' onChange={this.onChangeInsertar} />
									<hr />
									<Input type='text' name='apellido' onChange={this.onChangeInsertar} />
									<hr />
									<Input type='text' name='edad' onChange={this.onChangeInsertar} />
								</ModalBody>
								<ModalFooter>
									<Button outline color="info" onClick={this.peticionInsertar.bind(this)}>Insertar!</Button>{' '}
									<Button outline color="danger" onClick={this.modal2.bind(this)}>Cancelar</Button>
								</ModalFooter>
							</Modal>
							<FormGroup row style={{ marginLeft: "15px" }}>
								<Col md='3'>
									<Label htmlFor="textarea-input">Usuario</Label>
								</Col>
								<Input type="text" name='nickName' onChange={this.onChange} />
							</FormGroup>
							<hr />
							<FormGroup row style={{ marginLeft: "15px" }}>
								<Col md="3">
									<Label htmlFor="textarea-input">Contraseña</Label>
								</Col>
								<Input type="password" name='password' onChange={this.onChange} />
							</FormGroup>
							<hr />
							<FormGroup row style={{ marginLeft: "15px" }}>
								<table>
									<tbody>
										<tr>
											<td>
												<Button outline color='success' onClick={this.login}>Ingresar</Button>
											</td>
											<td>
												<Button outline color='info' onClick={this.modal2.bind(this)}>Insertar</Button>
											</td>
											<td>
												<Button outline color='warning' onClick={this.modal.bind(this)}>Solicitar</Button>
											</td>
										</tr>
									</tbody>
								</table>
							</FormGroup>
						</Col>
					</div>
				</header>
			</div>

		);
	}
}
export default App;