// PropertiesPanel.jsx
import React from 'react';

export default function PropertiesPanel({ selectedElement, updateElement, setIsEditing }) {
  if (!selectedElement) return null;

  const handleFocus = () => setIsEditing(true);
  const handleBlur = () => setIsEditing(false);

  const handleChange = (key, value) => {
    updateElement({
      ...selectedElement,
      props: {
        ...selectedElement.props,
        [key]: value,
      },
    });
  };

  return (
    <div className="fixed top-4 right-4 w-72 bg-white border shadow-lg p-4 rounded-lg z-50">
      <h2 className="text-xl font-bold mb-4">Propiedades</h2>

      {(selectedElement.type === 'text' ||
        selectedElement.type === 'button' ||
        selectedElement.type === 'input' ||
        selectedElement.type === 'select' ||
        selectedElement.type === 'card') && (
        <>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Texto</label>
            <input
              type="text"
              value={selectedElement.props.text || ''}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(e) => handleChange('text', e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Tamaño de Fuente</label>
            <input
              type="number"
              value={selectedElement.props.fontSize || 16}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </>
      )}

      {selectedElement.type === 'input' && (
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Placeholder</label>
          <input
            type="text"
            value={selectedElement.props.placeholder || ''}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => handleChange('placeholder', e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
      )}

      {(selectedElement.type === 'button' ||
        selectedElement.type === 'card' ||
        selectedElement.type === 'container') && (
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Color de Fondo</label>
          <input
            type="color"
            value={selectedElement.props.fill || selectedElement.props.backgroundColor || '#ffffff'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => {
              const color = e.target.value;
              if (selectedElement.type === 'button') {
                handleChange('fill', color);
              } else {
                handleChange('backgroundColor', color);
              }
            }}
            className="w-full"
          />
        </div>
      )}

      {(selectedElement.type === 'text' ||
        selectedElement.type === 'button' ||
        selectedElement.type === 'input' ||
        selectedElement.type === 'select') && (
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Color de Texto</label>
          <input
            type="color"
            value={selectedElement.props.color || '#000000'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-full"
          />
        </div>
      )}

      {selectedElement.type === 'grid' && (
        <>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Filas</label>
            <input
              type="number"
              value={selectedElement.props.rows || 2}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(e) => handleChange('rows', parseInt(e.target.value))}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Columnas</label>
            <input
              type="number"
              value={selectedElement.props.columns || 2}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(e) => handleChange('columns', parseInt(e.target.value))}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Ancho</label>
        <input
          type="number"
          value={selectedElement.props.width || 100}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => handleChange('width', parseInt(e.target.value))}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Alto</label>
        <input
          type="number"
          value={selectedElement.props.height || 100}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => handleChange('height', parseInt(e.target.value))}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      {(selectedElement.type === 'button' || selectedElement.type === 'container') && (
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Bordes Redondeados</label>
          <input
            type="number"
            value={selectedElement.props.cornerRadius || 0}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => handleChange('cornerRadius', parseInt(e.target.value))}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
      )}

      {selectedElement.type === 'image' && (
        <div className="mb-4">
          <label className="block mb-1 font-semibold">URL de Imagen</label>
          <input
            type="text"
            value={selectedElement.props.src || ''}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => handleChange('src', e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
      )}
    </div>
  );
}
