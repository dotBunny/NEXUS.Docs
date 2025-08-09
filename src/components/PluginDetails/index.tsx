import type { ReactNode } from 'react';
import styles from './styles.module.css';

type PluginDetailsItem = {
  icon: string;
  iconAlt: string;
  initialVersion: string;
};

export default function PluginDetails({ icon, iconAlt, initialVersion }: PluginDetailsItem): ReactNode {

  return (
    <div className={styles.pluginDetails}>
      <div className={styles.pluginDetails}>
        <img src={icon} alt={iconAlt} />
      </div>
      <div className={styles.pluginDetailsContainer}>
        <div className={styles.pluginDetailsRow}>
          <p>Initial Version:</p>
          <p>{initialVersion}</p>
        </div>
      </div>
    </div>
  );
}
