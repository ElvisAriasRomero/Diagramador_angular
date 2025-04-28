import React from 'react';
import { usePage } from '@inertiajs/react';
import CanvasBoard from '@/components/editor/CanvasBoard';

export default function Editor() {
  const { project, design } = usePage().props;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Editor de Diseño</h1>
        <p className="text-gray-600">Proyecto: {project.name}</p>
        <p className="text-gray-600">Diseño: {design.name}</p>
      </header>

      {/* Canvas real */}
      <CanvasBoard />
    </div>
  );
}
