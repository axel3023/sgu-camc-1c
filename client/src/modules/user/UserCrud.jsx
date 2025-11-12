// Ubicación: frontend/src/modules/user/UserCrud.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './UserCrud.css'; // Importa el archivo CSS

// URL base de tu API (coincide con @RequestMapping("/user"))
const API_BASE_URL = '/user';

function UserCrud() {
    // El estado 'users' se inicializa como un array vacío, ¡esto es correcto!
    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    
    const [currentUser, setCurrentUser] = useState({
        id: null,
        nombreCompleto: '',
        correoElectronico: '',
        numeroTelefono: ''
    });

    // 1. Cargar usuarios (se ejecuta una vez al cargar el componente)
    useEffect(() => {
        fetchUsers();
    }, []);

    // --- FUNCIÓN CORREGIDA ---
    // Esta función ahora se asegura de que 'users' siempre sea un array.
    const fetchUsers = async () => {
        try {
            // Conecta a tu endpoint: GET /user/
            const response = await axios.get(`${API_BASE_URL}/`);

            // --- INICIA LA CORRECCIÓN ---
            // El error 'users.map is not a function' ocurre si response.data
            // NO es un array (por ejemplo, si es 'null' o 'undefined').
            // Esta verificación se asegura de que 'users' SIEMPRE sea un array.
            if (Array.isArray(response.data)) {
                setUsers(response.data); // Es un array, lo usamos.
            } else {
                // No es un array (probablemente 'null'), 
                // así que forzamos un array vacío para evitar el error.
                console.warn("La respuesta de GET /user/ no fue un array:", response.data);
                setUsers([]); // Usamos un array vacío
            }
            // --- FIN DE LA CORRECCIÓN ---

        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            // En caso de un error de red, también usamos un array vacío.
            setUsers([]);
        }
    };
    // --- FIN FUNCIÓN CORREGIDA ---

    // 2. Manejador para cambios en el formulario
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentUser({ ...currentUser, [name]: value });
    };

    // 3. Manejador para enviar el formulario (Crear o Actualizar)
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!currentUser.nombreCompleto || !currentUser.correoElectronico) return;

        if (isEditing) {
            // ----- MODO ACTUALIZAR -----
            // Conecta a tu endpoint: PUT /user/update
            try {
                await axios.put(`${API_BASE_URL}/update`, currentUser);
                fetchUsers(); // Recargar lista
            } catch (error) {
                console.error("Error al actualizar usuario:", error);
            }
        } else {
            // ----- MODO CREAR -----
            // Conecta a tu endpoint: POST /user/save
            try {
                await axios.post(`${API_BASE_URL}/save`, currentUser);
                fetchUsers(); // Recargar lista
            } catch (error) {
                console.error("Error al crear usuario:", error);
            }
        }
        resetForm(); // Limpia el formulario
    };

    // 4. Poner un usuario en modo de edición
    const handleEdit = (user) => {
        setIsEditing(true);
        setCurrentUser(user); // Carga los datos del usuario en el formulario
    };

    // 5. Eliminar un usuario
    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
            return;
        }
        
        try {
            // Conecta a tu endpoint: DELETE /user/{id}
            await axios.delete(`${API_BASE_URL}/${id}`);
            fetchUsers(); // Recargar lista
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };

    // 6. Limpiar el formulario
    const resetForm = () => {
        setIsEditing(false);
        setCurrentUser({
            id: null,
            nombreCompleto: '',
            correoElectronico: '',
            numeroTelefono: ''
        });
    };

    return (
        <div className="user-crud-container">
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="crud-form">
                <h2>{isEditing ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
                
                <div className="form-input-group">
                    <label htmlFor="nombreCompleto">Nombre Completo</label>
                    <input
                        type="text"
                        name="nombreCompleto" 
                        id="nombreCompleto"
                        placeholder="Ej. Juan Pérez"
                        value={currentUser.nombreCompleto}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-input-group">
                    <label htmlFor="correoElectronico">Correo Electrónico</label>
                    <input
                        type="email"
                        name="correoElectronico" 
                        id="correoElectronico"
                        placeholder="Ej. juan.perez@correo.com"
                        value={currentUser.correoElectronico}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-input-group">
                    <label htmlFor="numeroTelefono">Número de Teléfono</label>
                    <input
                        type="tel"
                        name="numeroTelefono" 
                        id="numeroTelefono"
                        placeholder="Ej. 55 1234 5678"
                        value={currentUser.numeroTelefono}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar' : 'Guardar'}</button>
                    {isEditing && (
                        <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>
                    )}
                </div>
            </form>

            {/* Tabla de Usuarios */}
            <h2>Lista de Usuarios</h2>
            <div className="table-wrapper">
                <table className="crud-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Esta línea (159) es la que daba el error. 
                          Ahora está protegida porque 'users' SIEMPRE será un array.
                        */}
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.nombreCompleto}</td>
                                <td>{user.correoElectronico}</td>
                                <td>{user.numeroTelefono}</td>
                                <td className="actions-cell">
                                    <button className="btn btn-edit" onClick={() => handleEdit(user)}>Editar</button>
                                    <button className="btn btn-delete" onClick={() => handleDelete(user.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserCrud;