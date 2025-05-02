// CanvasBoard.jsx actualizado con grid funcional
import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Group, Transformer, Image as KonvaImage, Line } from 'react-konva';
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
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        setElements((prev) => prev.filter((el) => el.id !== selectedId));
        setSelectedId(null);
      }
      if (e.ctrlKey && e.key === 'd' && selectedId) {
        e.preventDefault();
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
    setSelectedId(e.target.id());
  };

  const addElement = (type) => {
    const id = `${type}-${elements.length + 1}`;
    let props = { x: 100, y: 100, draggable: true };

    switch (type) {
      case 'button':
        props = { ...props, width: 120, height: 40, fill: '#3498db', text: 'Button', fontSize: 18, color: '#fff', cornerRadius: 4 };
        break;
      case 'input':
        props = { ...props, width: 200, height: 40, text: 'Input', fontSize: 16, color: '#000', borderColor: '#ccc' };
        break;
      case 'checkbox':
        props = { ...props, width: 20, height: 20, checked: false };
        break;
      case 'select':
        props = { ...props, width: 200, height: 40, options: ['Option 1', 'Option 2'], text: 'Select', fontSize: 16, color: '#000' };
        break;
      case 'image':
        props = { ...props, width: 100, height: 100, src: '' };
        break;
      case 'text':
        props = { ...props, text: 'Sample Text', fontSize: 24, fill: '#000' };
        break;
      case 'card':
        props = { ...props, width: 300, height: 200, backgroundColor: '#f5f5f5', borderColor: '#ccc', borderWidth: 1, text: 'Card Title' };
        break;
      case 'grid':
        props = { ...props, width: 300, height: 200, rows: 3, columns: 3, lineColor: '#999' };
        break;
      case 'container':
        props = { ...props, width: 300, height: 300, backgroundColor: '#68B8F8', cornerRadius: 4 };
        break;
    }

    setElements([...elements, { id, type, props }]);
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
        selectedElement={elements.find(el => el.id === selectedId)}
        updateElement={(updatedEl) => setElements(prev => prev.map(el => el.id === updatedEl.id ? updatedEl : el))}
        setIsEditing={setIsEditing}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {['button', 'input', 'checkbox', 'select', 'image', 'text', 'card', 'grid', 'container'].map((type) => (
          <button key={type} onClick={() => addElement(type)} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded capitalize">{type}</button>
        ))}
        <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded">Guardar Diseño</button>
      </div>

      <div className="border-2 border-gray-400 rounded bg-white">
        <Stage
          width={window.innerWidth - 50}
          height={window.innerHeight - 250}
          onMouseDown={handleStageClick}
          onTouchStart={handleStageClick}
        >
          <Layer ref={layerRef}>
            {elements.map((el) => (
              <Group
                key={el.id}
                id={el.id}
                draggable={el.props.draggable}
                x={el.props.x}
                y={el.props.y}
                onClick={() => setSelectedId(el.id)}
              >
                {el.type === 'image' && el.props.src && (
                  <KonvaImage
                    image={(function () {
                      const img = new window.Image();
                      img.src = el.props.src;
                      return img;
                    })()}
                    width={el.props.width}
                    height={el.props.height}
                  />
                )}
                {el.type === 'text' && (
                  <Text text={el.props.text} fontSize={el.props.fontSize} fill={el.props.fill} />
                )}
                {el.type === 'card' && (
                  <>
                    <Rect width={el.props.width} height={el.props.height} fill={el.props.backgroundColor} stroke={el.props.borderColor} strokeWidth={el.props.borderWidth} />
                    <Text text={el.props.text} fontSize={18} fill="#333" padding={10} />
                  </>
                )}
                {el.type === 'grid' && (
                  <>
                    <Rect width={el.props.width} height={el.props.height} stroke={el.props.lineColor || '#999'} strokeWidth={1} />
                    {(() => {
                      const lines = [];
                      const { rows, columns, width, height, lineColor } = el.props;
                      for (let i = 1; i < columns; i++) {
                        const x = (width / columns) * i;
                        lines.push(<Line key={`v${i}`} points={[x, 0, x, height]} stroke={lineColor || '#999'} strokeWidth={1} />);
                      }
                      for (let i = 1; i < rows; i++) {
                        const y = (height / rows) * i;
                        lines.push(<Line key={`h${i}`} points={[0, y, width, y]} stroke={lineColor || '#999'} strokeWidth={1} />);
                      }
                      return lines;
                    })()}
                  </>
                )}
                {!['image', 'text', 'card', 'grid'].includes(el.type) && (
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
            <Transformer ref={trRef} />
          </Layer>
        </Stage>
      </div>

      <ExportButton elements={elements} designName={design.name} />
    </div>
  );
}
