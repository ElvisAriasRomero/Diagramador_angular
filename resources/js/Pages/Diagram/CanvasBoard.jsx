import React, { useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Transformer } from 'react-konva';

export default function CanvasBoard() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const trRef = useRef();

  const handleStageClick = (e) => {
    // Deseleccionar si se hace click fuera de un shape
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      return;
    }
    const clickedOn = e.target;
    setSelectedId(clickedOn.id());
  };

  const addText = () => {
    const id = `text-${elements.length + 1}`;
    setElements([
      ...elements,
      {
        id,
        type: 'text',
        props: {
          x: 50,
          y: 50,
          text: 'Nuevo Texto',
          fontSize: 24,
          fill: '#000000',
          draggable: true,
        },
      },
    ]);
  };

  const addRect = () => {
    const id = `rect-${elements.length + 1}`;
    setElements([
      ...elements,
      {
        id,
        type: 'rect',
        props: {
          x: 100,
          y: 100,
          width: 150,
          height: 100,
          fill: '#3498db',
          draggable: true,
        },
      },
    ]);
  };

  return (
    <div className="flex flex-col">
      {/* Botones para agregar elementos */}
      <div className="mb-4 space-x-4">
        <button
          onClick={addText}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Agregar Texto
        </button>
        <button
          onClick={addRect}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Agregar Botón
        </button>
      </div>

      {/* Canvas */}
      <div className="border-2 border-gray-400 rounded bg-white">
        <Stage
          width={1000}
          height={600}
          onMouseDown={handleStageClick}
          onTouchStart={handleStageClick}
        >
          <Layer>
            {elements.map((el, index) => {
              if (el.type === 'text') {
                return (
                  <Text
                    key={index}
                    id={el.id}
                    {...el.props}
                    onClick={() => setSelectedId(el.id)}
                    onTap={() => setSelectedId(el.id)}
                  />
                );
              } else if (el.type === 'rect') {
                return (
                  <Rect
                    key={index}
                    id={el.id}
                    {...el.props}
                    onClick={() => setSelectedId(el.id)}
                    onTap={() => setSelectedId(el.id)}
                  />
                );
              }
              return null;
            })}

            {/* Transformer para redimensionar */}
            {selectedId && (
              <Transformer
                ref={trRef}
                nodes={[trRef.current?.getStage().findOne(`#${selectedId}`)]}
                boundBoxFunc={(oldBox, newBox) => {
                  // Opcional: evitar que el shape se reduzca demasiado
                  if (newBox.width < 20 || newBox.height < 20) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
