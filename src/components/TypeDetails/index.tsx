import type { ReactNode } from 'react';
import styles from './styles.module.css';

export default function TypeDetails({ icon, moduleName, shortName, initialRelease, owner, children }): ReactNode {

  return (
    <div className={styles.typeDetails}>
      <div className={styles.typeDetailsIcon}><img src={icon} alt={moduleName} /></div>
      <dl>
        <dt>Module Name:</dt>
        <dd>{moduleName}</dd>
        <dt>Initial Release:</dt>
        <dd>{initialRelease}</dd>
        {children}
      </dl>
    </div>
  );
}