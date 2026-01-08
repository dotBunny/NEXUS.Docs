import type { ReactNode } from 'react';

export default function VersionBadge({ version, branch, type }): ReactNode {

  var baseClass = 'theme-doc-version-badge badge';
  if (type == 'header') {
    baseClass += ' badge-header';
  }

  if (branch == 'main') {
    baseClass += ' badge-main';
    version = '🚧' + version + '🚧';
    return (<span className={baseClass}><a href="https://github.com/orgs/dotBunny/projects/6/views/1">{version}</a></span>);
  }
  else {
    baseClass += ' badge--primary';
  }

  return (<span className={baseClass}>{version}</span>);
}