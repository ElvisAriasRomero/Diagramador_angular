import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Group, Transformer } from 'react-konva';
import { router } from '@inertiajs/react';
import PropertiesPanel from './PropertiesPanel';
import { Image as KonvaImage } from 'react-konva';
import ExportButton from '@/utils/ExportButton';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
window.Pusher.logToConsole = true; // Para depuración

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'app-key',
  wsHost: 'localhost',
  wsPort: 6001,
  cluster: 'mt1',
  forceTLS: false,
  encrypted: false,
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
});

// const echo = new Echo({
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
//     wsHost: import.meta.env.VITE_PUSHER_HOST,
//     wsPort: import.meta.env.VITE_PUSHER_PORT,
//     forceTLS: false,
//     disableStats: true,
//     enabledTransports: ['wfs'],
//   });

export default function CanvasBoard({ initialElements, designId, design }) {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const trRef = useRef();
  const layerRef = useRef();

  useEffect(() => {
    setElements(initialElements);
  }, [initialElements]);

  useEffect(() => {
    if (!designId) return;

    console.log('🔄 Intentando conectar al canal:', `design.${designId}`);

    const channel = echo.channel(`design.${designId}`);

    // Monitorear el estado de la conexión
    echo.connector.pusher.connection.bind('connected', () => {
      console.log('✅ Conexión WebSocket establecida');
      setIsConnected(true);
    });

    echo.connector.pusher.connection.bind('disconnected', () => {
      console.log('❌ Conexión WebSocket perdida');
      setIsConnected(false);
    });

    echo.connector.pusher.connection.bind('error', (err) => {
      console.error('❌ Error en la conexión WebSocket:', err);
    });

    channel.subscribed(() => {
      console.log('✅ Suscrito al canal exitosamente');
    }).error((error) => {
      console.error('❌ Error al suscribirse al canal:', error);
    });

    channel.listen('.DesignUpdated', (e) => {
      console.log('🔄 Diseño actualizado vía socket:', e);
      if (e.canvasData) {
        try {
          const parsedData = JSON.parse(e.canvasData);
          setElements(parsedData);
        } catch (error) {
          console.error('Error parsing canvas data:', error);
        }
      }
    });

    return () => {
      console.log('🔄 Limpiando conexión WebSocket');
      channel.stopListening('.DesignUpdated');
      echo.leave(`design.${designId}`);
      echo.connector.pusher.connection.unbind_all();
    };
  }, [designId]);

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
          props: { x: 50, y: 50, width: 120, height: 40, fill: '#3498db', text: 'Button', fontSize: 18, color: '#ffffff', cornerRadius: 4, draggable: true },
        };
        break;
      case 'input':
        newElement = {
          id,
          type,
          props: { x: 50, y: 150, width: 200, height: 40, placeholder: 'Input text...', text: 'Input', borderColor: '#cccccc', fontSize: 16, color: '#000000', draggable: true },
        };
        break;
      case 'checkbox':
        newElement = { id, type, props: { x: 50, y: 250, width: 20, height: 20, checked: false, draggable: true } };
        break;
      case 'select':
        newElement = { id, type, props: { x: 50, y: 350, width: 200, height: 40, options: ['Option 1', 'Option 2'], text: 'Select', fontSize: 16, color: '#000000', draggable: true } };
        break;
      case 'image':
        newElement = { id, type, props: { x: 100, y: 400, src: '', width: 100, height: 100, draggable: true } };
        break;
      case 'text':
        newElement = { id, type, props: { x: 100, y: 500, text: 'Sample Text', fontSize: 24, fill: '#000000', draggable: true } };
        break;
      case 'card':
        newElement = { id, type, props: { x: 200, y: 100, width: 300, height: 200, backgroundColor: '#00E5A8', borderColor: '#00E5A8', borderWidth: 2, draggable: true } };
        break;
      case 'grid':
        newElement = { id, type, props: { x: 300, y: 200, rows: 2, columns: 2, width: 400, height: 400, draggable: true } };
        break;
      case 'container':
        newElement = { id, type, props: { x: 400, y: 300, width: 300, height: 300, backgroundColor: '#68B8F8', cornerRadius: 4, draggable: true } };
        break;
      default:
        return;
    }
    setElements((prev) => [...prev, newElement]);
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

  const handleDragStart = (e) => {
    const id = e.target.id();
    setSelectedId(id);
  };

  const handleDragEnd = (e) => {
    const id = e.target.id();
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElements = elements.map(el => {
        if (el.id === id) {
          return {
            ...el,
            props: {
              ...el.props,
              x: e.target.x(),
              y: e.target.y(),
            },
          };
        }
        return el;
      });
      setElements(newElements);
      handleSave(newElements);
    }
  };

  const handleSave = (newElements = elements) => {
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };

    router.put(
      route('designs.update', designId),
      {
        name: design.name,
        canvas_data: JSON.stringify(newElements),
      },
      {
        preserveScroll: true,
        preserveState: true,
        headers,
        onSuccess: (response) => {
          console.log('✅ Diseño guardado correctamente', response);
        },
        onError: (errors) => {
          console.error('❌ Error al guardar el diseño:', errors);
          if (errors.response?.status === 403) {
            alert('No tienes permiso para editar este diseño');
          } else {
            alert('Error al guardar el diseño. Por favor, intenta de nuevo.');
          }
        }
      }
    );
  };

  return (
    <div className="flex flex-col relative">
      <PropertiesPanel
        selectedElement={elements.find(el => el.id === selectedId)}
        updateElement={(updatedEl) => {
          setElements(prev => prev.map(el => (el.id === updatedEl.id ? updatedEl : el)));
        }}
        setIsEditing={setIsEditing}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {['button', 'input', 'checkbox', 'select', 'image', 'text', 'card', 'grid', 'container'].map(type => (
          <button
            key={type}
            onClick={() => addElement(type)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded capitalize"
          >
            {type}
          </button>
        ))}
        <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded">Guardar Diseño</button>
        <button onClick={bringForward} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded">Traer Adelante</button>
        <button onClick={sendBackward} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded">Enviar Atrás</button>
      </div>

      <div className="border-2 border-gray-400 rounded bg-white">
        <Stage
          width={window.innerWidth - 50}
          height={window.innerHeight - 250}
          onClick={handleStageClick}
        >
          <Layer ref={layerRef}>
            {elements.map((el, index) => (
              <Group
                key={index}
                id={el.id}
                draggable={el.props.draggable}
                x={el.props.x}
                y={el.props.y}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                {el.type === 'text' ? (
                  <Text
                    text={el.props.text}
                    fontSize={el.props.fontSize}
                    fill={el.props.fill || '#000'}
                  />
                ) : (
                  <>
                    <Rect
                      width={el.props.width}
                      height={el.props.height}
                      fill={el.props.fill || el.props.backgroundColor || '#ccc'}
                      cornerRadius={el.props.cornerRadius || 0}
                    />
                    {el.props.text && (
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
            {selectedId && <Transformer ref={trRef} />}
          </Layer>
        </Stage>
      </div>

      <ExportButton elements={elements} designName={design.name} />
    </div>
  );
}
