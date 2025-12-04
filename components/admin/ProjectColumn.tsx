import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';
import styles from './ProjectColumn.module.css';

interface ProjectColumnProps {
  id: string;
  title: string;
  color: string;
  count: number;
  children: ReactNode;
}

export default function ProjectColumn({ id, title, color, count, children }: ProjectColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={styles.column}>
      <div className={styles.header} style={{ borderTopColor: color }}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.count}>{count}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`${styles.content} ${isOver ? styles.isOver : ''}`}
      >
        {children}
        {count === 0 && (
          <div className={styles.emptyState}>
            <p>No projects</p>
          </div>
        )}
      </div>
    </div>
  );
}
