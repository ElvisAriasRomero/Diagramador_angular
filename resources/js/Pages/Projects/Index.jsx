import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Index() {
  const { projects } = usePage().props;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Mis Proyectos</h1>
        <Link href={route('projects.create')} className="bg-blue-500 text-white px-4 py-2 rounded">
          Crear Proyecto
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{project.name}</h2>
            </div>
            <div className="space-x-2">
              {/* Nuevo botón para acceder a los diseños */}
              <Link
                href={route('projects.designs.index', project.id)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Ver Diseños
              </Link>

              <Link href={route('projects.edit', project.id)} className="text-blue-600">
                Editar
              </Link>

              <Link
                as="button"
                method="delete"
                href={route('projects.destroy', project.id)}
                className="text-red-600"
              >
                Eliminar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
