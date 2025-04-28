// components/ExportButton.jsx

import React from 'react';
import { convertCanvasToAngular } from '@/utils/jsonToAngular';
import { saveAs } from 'file-saver';

export default function ExportButton({ elements }) {

  const handleExport = () => {
    const { html, css, ts } = convertCanvasToAngular(elements);

    // Crear archivos Blob para cada tipo
    const htmlBlob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const cssBlob = new Blob([css], { type: 'text/css;charset=utf-8' });
    const tsBlob = new Blob([ts], { type: 'text/typescript;charset=utf-8' });

    // Guardar los archivos
    saveAs(htmlBlob, 'exported-design.component.html');
    saveAs(cssBlob, 'exported-design.component.css');
    saveAs(tsBlob, 'exported-design.component.ts');
  };

  return (
    <button
      onClick={handleExport}
      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded mt-4"
    >
      Exportar a Angular (.html, .css, .ts)
    </button>
  );
}
