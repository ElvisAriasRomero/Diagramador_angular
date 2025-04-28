import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Index() {
  const { project, designs } = usePage().props;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Diseños de {project.name}</h1>
        <Link href={route('projects.designs.create', project.id)} className="bg-blue-500 text-white px-4 py-2 rounded">
          Crear Diseño
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {designs.map((design) => (
          <div key={design.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{design.name}</h2>
            </div>
            <div className="space-x-2">
            <Link href={route('designs.edit', design.id)} className="text-blue-600">
                Editar
            </Link>

              <Link
                as="button"
                method="delete"
                href={route('designs.destroy', design.id)}
                className="text-red-600"
              >
                Eliminar
              </Link>
              <Link
                href={route('designs.editor', design.id)}
                className="text-green-600 hover:underline"
              >
                Abrir Editor
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
