// utils/jsonToAngular.js

export function convertCanvasToAngular(elements) {
    let htmlOutput = '';
    let cssOutput = '';
    let tsOutput = '';

    elements.forEach((element, index) => {
      const id = `el-${index}`;

      switch (element.type) {
        case 'button':
          htmlOutput += `<button id="${id}" class="${id}">${element.props.text || 'Button'}</button>\n`;
          cssOutput += `#${id} {\n  width: ${element.props.width}px;\n  height: ${element.props.height}px;\n  background-color: ${element.props.fill};\n  color: ${element.props.color};\n  font-size: ${element.props.fontSize}px;\n  border-radius: ${element.props.cornerRadius || 0}px;\n}\n\n`;
          break;

        case 'input':
          htmlOutput += `<input id="${id}" class="${id}" placeholder="${element.props.placeholder || ''}" />\n`;
          cssOutput += `#${id} {\n  width: ${element.props.width}px;\n  height: ${element.props.height}px;\n  color: ${element.props.color};\n  font-size: ${element.props.fontSize}px;\n}\n\n`;
          break;

        case 'checkbox':
          htmlOutput += `<input id="${id}" class="${id}" type="checkbox" />\n`;
          cssOutput += `#${id} {\n  width: ${element.props.width}px;\n  height: ${element.props.height}px;\n}\n\n`;
          break;

        case 'select':
          htmlOutput += `<select id="${id}" class="${id}">\n`;
          if (element.props.options) {
            element.props.options.forEach((option) => {
              htmlOutput += `  <option>${option}</option>\n`;
            });
          }
          htmlOutput += `</select>\n`;
          cssOutput += `#${id} {\n  width: ${element.props.width}px;\n  height: ${element.props.height}px;\n  color: ${element.props.color};\n  font-size: ${element.props.fontSize}px;\n}\n\n`;
          break;

        case 'image':
          htmlOutput += `<img id="${id}" class="${id}" src="${element.props.src}" />\n`;
          cssOutput += `#${id} {\n  width: ${element.props.width}px;\n  height: ${element.props.height}px;\n}\n\n`;
          break;

        case 'text':
          htmlOutput += `<p id="${id}" class="${id}">${element.props.text || 'Texto'}</p>\n`;
          cssOutput += `#${id} {\n  font-size: ${element.props.fontSize}px;\n  color: ${element.props.fill};\n}\n\n`;
          break;

        case 'card':
        case 'container':
          htmlOutput += `<div id="${id}" class="${id}"></div>\n`;
          cssOutput += `#${id} {\n  width: ${element.props.width}px;\n  height: ${element.props.height}px;\n  background-color: ${element.props.backgroundColor};\n  border-radius: ${element.props.cornerRadius || 0}px;\n}\n\n`;
          break;

        default:
          break;
      }
    });

    // TypeScript básico
    tsOutput = `import { Component } from '@angular/core';\n\n@Component({\n  selector: 'app-exported-design',\n  templateUrl: './exported-design.component.html',\n  styleUrls: ['./exported-design.component.css']\n})\nexport class ExportedDesignComponent { }\n`;

    return { html: htmlOutput, css: cssOutput, ts: tsOutput };
  }
