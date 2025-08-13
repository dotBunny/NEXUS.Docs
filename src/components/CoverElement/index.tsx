import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type CoverElementItem = {
  content: ReactNode;
  background: string;
  padding: number;
};

export default function CoverElement({ content, background, padding }: CoverElementItem): ReactNode {
  var divStyle = {
    backgroundImage: `url(${background})`,
    "padding": padding
  };

  return (
    <div className="coverElement" style={divStyle}>
      <div className="container">
        <div className="row">
          {content}
        </div>
      </div>
    </div>
  );
}
