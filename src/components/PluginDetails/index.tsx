import type { ReactNode } from 'react';
import styles from './styles.module.css';
import ContributorLink from '../ContributorLink'

export default function PluginDetails({ icon, moduleName, shortName, initialRelease, owner, children }): ReactNode {

  return (
    <div className={styles.pluginDetails}>
      <div className={styles.pluginDetailsIcon}><img src={icon} alt={moduleName} /></div>
      <dl>
        <dt>Module Name:</dt>
        <dd>{moduleName}</dd>
        <dt>Initial Release:</dt>
        <dd>{initialRelease}</dd>
        {children}
        <dt>Area Owner:</dt>
        <dd><ContributorLink id={owner} /></dd>
      </dl>
    </div>
  );
}