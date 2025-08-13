import type { ReactNode } from 'react';
import classnames from "classnames";
import useBaseUrl from "@docusaurus/useBaseUrl";
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import CoverElement from '../components/CoverElement';


function CoverContent(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className={styles.coverContent} >
      <img src="/assets/images/brand.png" className={styles.brand} alt="NEXUS Framework" />
      <p className={styles.tagline}>A <strong>battle-tested</strong> collection of game-ready plugins for <strong>Unreal Engine</strong>.</p>
      <p className={styles.tagline}>The <strong>NEXUS Framework</strong> offers commonly used patterns and <strong><em>opinionated</em></strong> solutions for various areas of <strong>game development</strong>.</p>
      <div className={styles.buttons}>
        <Link className={classnames("button button--primary button--lg shadow--tl", styles.buttonDownload)}
          to={"https://github.com/dotBunny/NEXUS"}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className={styles.buttonSVG}>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
          </svg> Download</Link>
        <Link className={classnames("button button--secondary button--lg shadow--tl", styles.buttonStart)}
          to={useBaseUrl("docs/getting-started/")}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className={styles.buttonSVGRP}>
            <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849" />
          </svg>
          Get Started</Link>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description={`${siteConfig.tagline}`}>
      <main>
        <CoverElement content={<CoverContent />} background="/assets/images/background.jpg" padding={45} />
      </main>
    </Layout >
  );
}