import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
//import { config } from '@fortawesome/fontawesome-svg-core';

const url="https://gorest.co.in/public/v2/users"; 
const url2="https://gorest.co.in/public-api/users";
 

class App extends Component {
  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{
      id: '',
      name: '',
      email: '',
      gender: '',
      status: '',
      tipoModal: ''
    }
  }
  


  

  peticionGet=()=>{
    axios.get(url).then(response=>{
      this.setState({data: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPost=async()=>{
    await axios.post(url,this.state.form).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPut=()=>{
    console.log(url+'/'+this.state.form.id)
    axios.put(url+this.state.form.id, this.state.form).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete=()=>{
    axios.delete(url+this.state.form.id).then(response=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    })
  }

  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  seleccionarTodo=(todo)=>{
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: todo.id,
        name: todo.name,
        email: todo.email,
        gender: todo.gender,
        status: todo.status,
      }
    })
  }

  handleChange=async e=>{
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
    }

  componentDidMount() { 
    this.peticionGet();
  }


  render(){
    const {form}=this.state;
  
  return (
    <div className="App">
      <h1>Datos Personales</h1>
      <br />
      <button className="btn btn-success"  onClick={()=>{this.setState({form: null, tipoModal: 'crear'}); this.modalInsertar()}}>Nueva Persona</button>
      <br /><br />
      <table className="table ">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Genero</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map(todo=>{
            return(
              <tr>
              <td>{todo.id}</td>
              <td>{todo.name}</td>
              <td>{todo.email}</td>
              <td>{todo.gender}</td>
              <td>{todo.status}</td>
              <td>
                 <button className="btn btn-primary" onClick={()=>{this.seleccionarTodo(todo); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                 {"  "}
                 <button className="btn btn-danger" onClick={()=>{this.seleccionarTodo(todo); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
              </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <Modal isOpen={this.state.modalInsertar}>
        <ModalHeader style={{display: 'block'}}>
          <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <h1>Información Personal</h1>
            <label htmlFor="id">ID</label>
            <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id: this.state.data.length+1}/>
            <br />
            <label htmlFor="name">Nombre</label>
            <input className="form-control" type="text" name="name" id="name" onChange={this.handleChange} value={form?form.name: ''}/>
            <br />
            <label htmlFor="email">Email</label>
            <input className="form-control" type="email" name="email" id="email" onChange={this.handleChange} value={form?form.email: ''}/>
            <br />
            <label htmlFor="gender">Genero</label>
            <input className="form-control" type="text" name="gender" id="gender"  onChange={this.handleChange} value={form?form.gender: ''}/>
            <br /> 
            <label htmlFor="status">Estado</label>
            <input className="form-control" type="text" name="status" id="status" onChange={this.handleChange} value={form?form.status: ''}/>

            </div>

        </ModalBody>

        <ModalFooter>
        {this.state.tipoModal=='Crear'?
                    <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Crear
                  </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                    Actualizar
                  </button>
                  }
            <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar esta persona {form && form.name}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>

    </div>
  );
}
}

export default App;
