import type { ReactNode } from 'react';

export default function TypeDetails({ icon, base, type, typeExtra, headerFile, children }): ReactNode {

  const classes = 'type ' + icon;

  var baseClass = 'base';
  if (base == 'interface' || base == 'class' || base == 'struct') {
    baseClass += ' base-primitive';
  }

  var typeClass = 'type';

  return (
    <div className="typeDetails">
      <div className="typeDetailsIcon"><p className={classes}></p></div>
      <dl>
        <dt>Base:</dt>
        <dd className={baseClass}>{base}</dd>
        <dt>Type:</dt>
        <dd className={typeClass}>{type} <span>{typeExtra}</span></dd>
        <dt>Header File:</dt>
        <dd className="headerFile">{headerFile}</dd>
        {children}
      </dl>
    </div >
  );
}