import React, { useState } from 'react';
import { router, usePage, Link } from '@inertiajs/react';

export default function Collaborators() {
  const { project, collaborators, allUsers } = usePage().props;
  const [selectedUserId, setSelectedUserId] = useState('');

  const handleAddCollaborator = (e) => {
    e.preventDefault();

    if (!selectedUserId) return;

    router.post(route('projects.collaborators.add', project.id), {
      user_id: selectedUserId,
    });
  };

  const handleRemoveCollaborator = (userId) => {
    if (!confirm('¿Estás seguro de eliminar este colaborador?')) return;

    router.delete(route('projects.collaborators.remove', { project: project.id, user: userId }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Colaboradores de: {project.name}</h1>

        <Link
          href={route('projects.index')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Volver a Proyectos
        </Link>
      </div>

      {/* Agregar Colaborador */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Agregar Colaborador</h2>

        <form onSubmit={handleAddCollaborator} className="flex space-x-4">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">-- Seleccionar Usuario --</option>
            {allUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Agregar
          </button>
        </form>
      </div>

      {/* Listado de Colaboradores */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Lista de Colaboradores</h2>

        {collaborators.length === 0 ? (
          <p className="text-gray-500">No hay colaboradores todavía.</p>
        ) : (
          <ul className="space-y-2">
            {collaborators.map((collab) => (
              <li key={collab.id} className="flex justify-between items-center">
                <div>
                  {collab.user.name} ({collab.user.email})
                </div>
                <button
                  onClick={() => handleRemoveCollaborator(collab.user_id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
