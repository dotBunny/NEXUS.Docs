import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type CoverElementItem = {
  content: ReactNode;
  background: string;
};

export default function CoverElement({ content, background }: CoverElementItem): ReactNode {
  return (
    <div className={styles.coverElement} style={{ backgroundImage: `url(${background})` }}>
      <div className="container">
        <div className="row">
          {content}
        </div>
      </div>
    </div>
  );
}
