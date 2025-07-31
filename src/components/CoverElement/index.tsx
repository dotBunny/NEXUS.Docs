import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type CoverElementItem = {
  content: ReactNode;
  background: string;
  borderTopColor: string;
  borderTopWidth: number;
  borderBottomColor: string;
  borderBottomWidth: number;
  padding: number;
};

export default function CoverElement({ content, background, borderTopColor, borderTopWidth, borderBottomColor, borderBottomWidth, padding }: CoverElementItem): ReactNode {
  var divStyle = {
    backgroundImage: `url(${background})`,
    borderTopWidth: borderTopWidth,
    borderTopColor: borderTopColor,
    borderBottomWidth: borderBottomWidth,
    borderBottomColor: borderBottomColor,
    "padding": padding
  };

  if (borderTopWidth > 0) {
    divStyle["border-top-style"] = "solid"
  }
  else {
    divStyle[borderTopColor] = undefined;
  }

  if (borderBottomWidth > 0) {
    divStyle["border-bottom-style"] = "solid"
  }
  else {
    divStyle[borderBottomColor] = undefined;
  }

  return (
    <div className={styles.coverElement} style={divStyle}>
      <div className="container">
        <div className="row">
          {content}
        </div>
      </div>
    </div >
  );
}
