import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function Create() {
  const { project } = usePage().props;
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post(route('projects.designs.store', project.id), { name });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Crear Diseño para {project.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre del Diseño</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
