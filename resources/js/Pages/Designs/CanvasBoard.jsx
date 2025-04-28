import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Group, Transformer } from 'react-konva';
import { router } from '@inertiajs/react';
import PropertiesPanel from './PropertiesPanel';

import ExportButton from '@/utils/ExportButton';

export default function CanvasBoard({ initialElements, designId, design }) {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const trRef = useRef();
  const layerRef = useRef();

  useEffect(() => {
    setElements(initialElements);
  }, [initialElements]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isEditing) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          setElements((prev) => prev.filter((el) => el.id !== selectedId));
          setSelectedId(null);
        }
      }
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        if (selectedId) {
          const element = elements.find((el) => el.id === selectedId);
          if (element) {
            const newElement = {
              ...element,
              id: `${element.type}-${elements.length + 1}`,
              props: {
                ...element.props,
                x: element.props.x + 20,
                y: element.props.y + 20,
              },
            };
            setElements((prev) => [...prev, newElement]);
            setSelectedId(newElement.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [elements, selectedId, isEditing]);

  useEffect(() => {
    if (trRef.current && selectedId) {
      const selectedNode = layerRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      return;
    }
    const clickedOn = e.target;
    setSelectedId(clickedOn.id());
  };

  const addElement = (type) => {
    const id = `${type}-${elements.length + 1}`;
    let newElement = null;

    switch (type) {
      case 'button':
        newElement = {
          id,
          type,
          props: {
            x: 50,
            y: 50,
            width: 120,
            height: 40,
            fill: '#3498db',
            text: 'Button',
            fontSize: 18,
            color: '#ffffff',
            cornerRadius: 4,
            draggable: true,
          },
        };
        break;
      case 'input':
        newElement = {
          id,
          type,
          props: {
            x: 50,
            y: 150,
            width: 200,
            height: 40,
            placeholder: 'Input text...',
            borderColor: '#cccccc',
            text: 'Input',
            fontSize: 16,
            color: '#000000',
            draggable: true,
          },
        };
        break;
      case 'checkbox':
        newElement = {
          id,
          type,
          props: {
            x: 50,
            y: 250,
            width: 20,
            height: 20,
            checked: false,
            draggable: true,
          },
        };
        break;
      case 'select':
        newElement = {
          id,
          type,
          props: {
            x: 50,
            y: 350,
            width: 200,
            height: 40,
            options: ['Option 1', 'Option 2'],
            text: 'Select',
            fontSize: 16,
            color: '#000000',
            draggable: true,
          },
        };
        break;
      case 'image':
        newElement = {
          id,
          type,
          props: {
            x: 100,
            y: 400,
            src: '',
            width: 100,
            height: 100,
            draggable: true,
          },
        };
        break;
      case 'text':
        newElement = {
          id,
          type,
          props: {
            x: 100,
            y: 500,
            text: 'Sample Text',
            fontSize: 24,
            fill: '#000000',
            draggable: true,
          },
        };
        break;
      case 'card':
        newElement = {
          id,
          type,
          props: {
            x: 200,
            y: 100,
            width: 300,
            height: 200,
            backgroundColor: '#00E5A8',
            borderColor: '#00E5A8',
            borderWidth: 2,
            draggable: true,
          },
        };
        break;
      case 'grid':
        newElement = {
          id,
          type,
          props: {
            x: 300,
            y: 200,
            rows: 2,
            columns: 2,
            width: 400,
            height: 400,
            draggable: true,
          },
        };
        break;
      case 'container':
        newElement = {
          id,
          type,
          props: {
            x: 400,
            y: 300,
            width: 300,
            height: 300,
            backgroundColor: '#f8f9fa',
            cornerRadius: 4,
            draggable: true,
          },
        };
        break;
      default:
        return;
    }

    setElements([...elements, newElement]);
  };

  const bringForward = () => {
    if (!selectedId) return;
    const idx = elements.findIndex(el => el.id === selectedId);
    if (idx < elements.length - 1) {
      const newElements = [...elements];
      [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
      setElements(newElements);
    }
  };

  const sendBackward = () => {
    if (!selectedId) return;
    const idx = elements.findIndex(el => el.id === selectedId);
    if (idx > 0) {
      const newElements = [...elements];
      [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
      setElements(newElements);
    }
  };

  const handleSave = () => {
    router.put(route('designs.update', designId), {
      name: design.name,
      canvas_data: JSON.stringify(elements),
    });
  };

  return (
    <div className="flex flex-col relative">

      <PropertiesPanel
        selectedElement={elements.find((el) => el.id === selectedId)}
        updateElement={(updatedEl) => {
          setElements((prev) =>
            prev.map((el) => (el.id === updatedEl.id ? updatedEl : el))
          );
        }}
        setIsEditing={setIsEditing}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => addElement('button')} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded">Button</button>
        <button onClick={() => addElement('input')} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded">Input</button>
        <button onClick={() => addElement('checkbox')} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded">Checkbox</button>
        <button onClick={() => addElement('select')} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded">Select</button>
        <button onClick={() => addElement('image')} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded">Image</button>
        <button onClick={() => addElement('text')} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded">Text</button>
        <button onClick={() => addElement('card')} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded">Card</button>
        <button onClick={() => addElement('grid')} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded">Grid</button>
        <button onClick={() => addElement('container')} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded">Container</button>
        <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded">Guardar Diseño</button>
        <button onClick={bringForward} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded">Traer Adelante</button>
        <button onClick={sendBackward} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded">Enviar Atrás</button>
      </div>

      <div className="border-2 border-gray-400 rounded bg-white">
        <Stage
          width={window.innerWidth - 50}
          height={window.innerHeight - 250}
          onMouseDown={handleStageClick}
          onTouchStart={handleStageClick}
        >
          <Layer ref={layerRef}>
            {elements.map((el, index) => (
              <Group
                key={index}
                id={el.id}
                draggable={el.props.draggable}
                x={el.props.x}
                y={el.props.y}
                onClick={() => setSelectedId(el.id)}
                onTap={() => setSelectedId(el.id)}
              >
                {(el.type === 'text') && (
                  <Text
                    text={el.props.text}
                    fontSize={el.props.fontSize}
                    fill={el.props.fill || '#000'}
                  />
                )}
                {(el.type !== 'text') && (
                  <>
                    <Rect
                      width={el.props.width}
                      height={el.props.height}
                      fill={el.props.fill || el.props.backgroundColor || '#ccc'}
                      cornerRadius={el.props.cornerRadius || 0}
                    />
                    {(el.props.text) && (
                      <Text
                        text={el.props.text}
                        fontSize={el.props.fontSize || 16}
                        fill={el.props.color || '#000'}
                        width={el.props.width}
                        height={el.props.height}
                        align="center"
                        verticalAlign="middle"
                      />
                    )}
                  </>
                )}
              </Group>
            ))}
            <Transformer ref={trRef} />
          </Layer>
        </Stage>
      </div>

      {/* 🚀 Aquí añadimos el botón para exportar */}
      <ExportButton elements={elements} />

    </div>
  );
}
