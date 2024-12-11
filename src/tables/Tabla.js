import React, { useEffect, useState } from 'react';
import './Tabla.css'; // Crea este archivo para estilizar la tabla

const Tabla = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: null, name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = 'http://localhost:3001/users'; // URL del backend

  // Obtener usuarios del backend
  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Agregar usuario
  const handleAddUser = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email }),
      });

      if (response.ok) {
        fetchUsers();
        setForm({ id: null, name: '', email: '' });
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Editar usuario
  const handleEditUser = (user) => {
    setForm(user);
    setIsEditing(true);
  };

  // Guardar edición
  const handleSaveEdit = async () => {
    try {
        const response = await fetch(`${API_URL}/${form.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: form.name, email: form.email }),
        });

        if (response.ok) {
            fetchUsers(); // Actualizar la lista de usuarios después de guardar
            setForm({ id: null, name: '', email: '' });
            setIsEditing(false);
        } else {
            console.error('Error saving user edit:', response.statusText);
        }
    } catch (error) {
        console.error('Error connecting to backend:', error);
    }
};


  // Eliminar usuario
  const handleDeleteUser = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="tabla-container">
      <h2>Lista de Usuarios</h2>

      <form className="tabla-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleInputChange}
        />
        {isEditing ? (
          <button type="button" onClick={handleSaveEdit}>Guardar</button>
        ) : (
          <button type="button" onClick={handleAddUser}>Añadir</button>
        )}
      </form>

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleEditUser(user)}>Editar</button>
                  <button onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay usuarios</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tabla;