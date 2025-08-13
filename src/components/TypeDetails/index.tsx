import type { ReactNode } from 'react';
import styles from './styles.module.css';

export default function TypeDetails({ icon, typeName, typeNameExtra, headerFile, children }): ReactNode {

  return (
    <div className={styles.typeDetails}>
      <div className={styles.typeDetailsIcon}>{icon}</div>
      <dl>
        <dt>Type Name:</dt>
        <dd>{typeName} <span>{typeNameExtra}</span></dd>
        <dt>Header File:</dt>
        <dd>{headerFile}</dd>
        {children}
      </dl>
    </div>
  );
}