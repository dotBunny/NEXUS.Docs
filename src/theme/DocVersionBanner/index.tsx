import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  useActivePlugin,
  useDocVersionSuggestions,
  useDocsPreferredVersion,
  useDocsVersion,
} from '@docusaurus/plugin-content-docs/client';
import {ThemeClassNames} from '@docusaurus/theme-common';
import type {PropVersionMetadata} from '@docusaurus/plugin-content-docs';
import type {Props} from '@theme/DocVersionBanner';

/**
 * Swizzled from @docusaurus/theme-classic to change the suggestion sentence.
 *
 * Two differences from the stock banner:
 *  - Both sentences sit on one line, and the link is the words "this page".
 *  - When the page has no counterpart in the latest version, the stock banner
 *    silently links to that version's *main doc* instead. That is misleading —
 *    the reader is told to see "this page" and lands somewhere else — so we say
 *    so plainly and render no link at all.
 *
 * The text is inlined rather than driven by i18n/en/code.json: adding an i18n
 * folder switches on the docs plugin's sidebar-translation pass, which requires
 * every category label to be unique, and the auto-generated sidebar reuses
 * "Types" / "Editor Types" under every plugin by design.
 */
function BannerLabel({
  siteTitle,
  versionMetadata,
}: {
  siteTitle: string;
  versionMetadata: PropVersionMetadata;
}): ReactNode {
  if (versionMetadata.banner === 'unmaintained') {
    return (
      <>
        This is documentation for {siteTitle} <b>{versionMetadata.label}</b>,
        which is no longer actively maintained.
      </>
    );
  }
  return (
    <>
      This is unreleased documentation for {siteTitle}{' '}
      <b>{versionMetadata.label}</b> version.
    </>
  );
}

function DocVersionBannerEnabled({
  className,
  versionMetadata,
}: Props & {versionMetadata: PropVersionMetadata}): ReactNode {
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {pluginId} = useActivePlugin({failfast: true});
  const {savePreferredVersionName} = useDocsPreferredVersion(pluginId);
  const {latestDocSuggestion, latestVersionSuggestion} =
    useDocVersionSuggestions(pluginId);

  return (
    <div
      className={clsx(
        className,
        ThemeClassNames.docs.docVersionBanner,
        'alert alert--warning margin-bottom--md',
      )}
      role="alert">
      <div>
        <BannerLabel siteTitle={siteTitle} versionMetadata={versionMetadata} />{' '}
        {latestDocSuggestion ? (
          <>
            Check out the released version ({latestVersionSuggestion.label})
            documentation of{' '}
            <Link
              to={latestDocSuggestion.path}
              onClick={() =>
                savePreferredVersionName(latestVersionSuggestion.name)
              }>
              <b>this page</b>
            </Link>
            .
          </>
        ) : (
          <>This page is not available elsewhere.</>
        )}
      </div>
    </div>
  );
}

export default function DocVersionBanner({className}: Props): ReactNode {
  const versionMetadata = useDocsVersion();
  if (versionMetadata.banner) {
    return (
      <DocVersionBannerEnabled
        className={className}
        versionMetadata={versionMetadata}
      />
    );
  }
  return null;
}
