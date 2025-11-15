import { useState } from 'react';
import styles from './TeamMember.module.css';

type TeamMemberProps = {
  name: string;
  title: string;
  bio: string;
  image: string;
  linkedIn?: string;
};

export default function TeamMember({ name, title, bio, image, linkedIn }: TeamMemberProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Create placeholder image with initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const placeholderUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=1a1a1a&color=fff&bold=true`;

  return (
    <div
      className={styles.teamMember}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={styles.imageWrapper}>
        <img
          src={imgError ? placeholderUrl : image}
          alt={name}
          className={styles.image}
          onError={() => setImgError(true)}
        />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.title}>{title}</p>
      </div>

      <div className={`${styles.bio} ${isExpanded ? styles.expanded : ''}`}>
        <p className={styles.bioTitle}>{title}</p>
        <p className={styles.bioText}>{bio}</p>
        {linkedIn && (
          <a
            href={linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkedIn}
            aria-label={`Visit ${name}'s LinkedIn profile`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
