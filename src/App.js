// src/App.js
import React, { useState } from 'react';
import CustomDraggable from './Components/CustomDraggable';
import './App.css';

const App = () => {
  const [components, setComponents] = useState([
    {
      id: 0,
      parent: null,
      width: 200,
      height: 150,
      x: (window.innerWidth - 200) / 2,
      y: (window.innerHeight - 150) / 2,
    },
  ]);

  const addParent = () => {
    setComponents((prevComponents) => {
      const lastComponent = prevComponents[0];
      const newId = prevComponents.length;
      const newParentWidth = lastComponent.width + 100;
      const newParentHeight = lastComponent.height + 100;
      const newParentX = (window.innerWidth - newParentWidth) / 2;
      const newParentY = (window.innerHeight - newParentHeight) / 2;

      return [
        {
          id: newId,
          parent: null,
          width: newParentWidth,
          height: newParentHeight,
          x: newParentX,
          y: newParentY,
        },
        ...prevComponents.map((component, index) =>
          index === 0
            ? {
                ...component,
                parent: newId,
                x: (newParentWidth - component.width) / 2,
                y: (newParentHeight - component.height) / 2,
              }
            : component
        ),
      ];
    });
  };

  const calculateBounds = (component) => {
    const parentComponent = components.find((comp) => comp.id === component.parent);
    if (parentComponent) {
      return {
        left: 0,
        top: 0,
        right: parentComponent.width - component.width,
        bottom: parentComponent.height - component.height,
      };
    }
    return {
      left: 0,
      top: 0,
      right: window.innerWidth - component.width,
      bottom: window.innerHeight - component.height,
    };
  };

  const renderComponents = (parentId) => {
    return components
      .filter((component) => component.parent === parentId)
      .map((component) => (
        <CustomDraggable
          key={component.id}
          title={`Title ${component.id}`}
          width={component.width}
          height={component.height}
          bounds={calculateBounds(component)}
          initialPosition={{ x: component.x, y: component.y }}
        >
          {renderComponents(component.id)}
        </CustomDraggable>
      ));
  };

  return (
    <div className="app-container">
      {renderComponents(null)}
      <button className="add-parent-button" onClick={addParent}>Add Parent</button>
    </div>
  );
};

export default App;
