import React from 'react';
import { saveAs } from 'file-saver';

export default function ExportButton({ elements, designName }) {
  const handleExport = () => {
    let html = `<div class="container">\n`;
    let css = `.container { position: relative; width: 100%; height: 100%; }\n`;
    let ts = `// Archivo generado automáticamente desde el editor\n\n`;

    elements.forEach((el, index) => {
      const { x, y, width, height, text, src, color, fill, fontSize, placeholder, options, backgroundColor, cornerRadius } = el.props;
      const commonStyle = `position: absolute; left: ${x}px; top: ${y}px; width: ${width || 100}px; height: ${height || 40}px;`;

      if (el.type === 'button') {
        html += `<button style="${commonStyle} background-color: ${fill}; color: ${color}; border-radius: ${cornerRadius || 0}px;">${text}</button>\n`;
      } else if (el.type === 'input') {
        html += `<input type="text" placeholder="${placeholder || ''}" style="${commonStyle} border: 1px solid #ccc; padding: 5px;"/>\n`;
      } else if (el.type === 'checkbox') {
        html += `<input type="checkbox" style="${commonStyle}"/>\n`;
      } else if (el.type === 'select') {
        html += `<select style="${commonStyle}">\n`;
        (options || []).forEach(option => {
          html += `<option>${option}</option>\n`;
        });
        html += `</select>\n`;
      } else if (el.type === 'image') {
        html += `<img src="${src}" style="${commonStyle} object-fit: cover;"/>\n`;
      } else if (el.type === 'text') {
        html += `<p style="${commonStyle} font-size: ${fontSize}px; color: ${fill};">${text}</p>\n`;
      } else if (el.type === 'card' || el.type === 'container') {
        html += `<div style="${commonStyle} background-color: ${backgroundColor}; border-radius: ${cornerRadius || 0}px;"></div>\n`;
      }
    });

    html += `</div>`;

    // Crear blobs y descargar
    const blobHtml = new Blob([html], { type: 'text/html;charset=utf-8' });
    const blobCss = new Blob([css], { type: 'text/css;charset=utf-8' });
    const blobTs = new Blob([ts], { type: 'text/typescript;charset=utf-8' });

    saveAs(blobHtml, `${designName}.html`);
    saveAs(blobCss, `${designName}.css`);
    saveAs(blobTs, `${designName}.ts`);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-2 rounded"
    >
      Exportar Diseño
    </button>
  );
}

