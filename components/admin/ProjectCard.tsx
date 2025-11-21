import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    priority: string;
    dueDate: string | null;
    users: {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
    } | null;
  };
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export default function ProjectCard({ project, onEdit, onDelete, isDragging = false }: ProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return '#dc2626';
      case 'HIGH':
        return '#f59e0b';
      case 'MEDIUM':
        return '#3b82f6';
      case 'LOW':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className={styles.overdue}>Overdue</span>;
    } else if (diffDays === 0) {
      return <span className={styles.today}>Today</span>;
    } else if (diffDays === 1) {
      return <span>Tomorrow</span>;
    } else if (diffDays <= 7) {
      return <span className={styles.soon}>{diffDays} days</span>;
    } else {
      return <span>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{project.title}</h3>
        <div className={styles.actions}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className={styles.editButton}
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={styles.deleteButton}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {project.description && (
        <p className={styles.description}>
          {project.description.length > 100
            ? `${project.description.substring(0, 100)}...`
            : project.description}
        </p>
      )}

      <div className={styles.footer}>
        <div className={styles.metadata}>
          <span
            className={styles.priorityBadge}
            style={{ backgroundColor: getPriorityColor(project.priority) }}
          >
            {project.priority}
          </span>
          {project.dueDate && (
            <span className={styles.dueDate}>
              📅 {formatDate(project.dueDate)}
            </span>
          )}
        </div>

        {project.users && (
          <div className={styles.assignee}>
            {project.users.avatar ? (
              <img
                src={project.users.avatar}
                alt={project.users.name}
                className={styles.avatar}
                title={project.users.name}
              />
            ) : (
              <div className={styles.avatarPlaceholder} title={project.users.name}>
                {project.users.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
