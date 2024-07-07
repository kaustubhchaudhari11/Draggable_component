// src/CustomDraggable.js
import React, { useState, useRef, useEffect, useCallback } from 'react';

const CustomDraggable = ({ title, children, width, height, bounds, initialPosition }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const dragRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    if (e.target.classList.contains('handle')) {
      setIsDragging(true);
      offset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      e.stopPropagation();
    }
  };

  const onMouseMove = useCallback((e) => {
    if (isDragging) {
      let newX = e.clientX - offset.current.x;
      let newY = e.clientY - offset.current.y;

      if (bounds) {
        const { left, top, right, bottom } = bounds;
        newX = Math.max(left, Math.min(newX, right));
        newY = Math.max(top, Math.min(newY, bottom));
      }

      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, bounds]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <div
      ref={dragRef}
      style={{
        ...styles.container,
        width,
        height,
        left: position.x,
        top: position.y,
      }}
      onMouseDown={onMouseDown}
    >
      <div className="handle" style={styles.header}>{title}</div>
      <div style={styles.content}>{children}</div>
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    position: 'absolute',
    padding: '10px',
  },
  header: {
    backgroundColor: '#f1f1f1',
    padding: '5px',
    cursor: 'move',
    textAlign: 'center',
  },
  content: {
    padding: '10px',
    minHeight: '50px',
  },
};

export default CustomDraggable;
