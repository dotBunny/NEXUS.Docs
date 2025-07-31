import type { ReactNode } from 'react';
import classnames from "classnames";
import useBaseUrl from "@docusaurus/useBaseUrl";
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
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
        <Link className={classnames("button button--primary button--lg shadow--tl", styles.getStarted)}
          to={"https://github.com/dotBunny/NEXUS"}>
          Download From GitHub
        </Link>
        <Link className={classnames("button button--secondary button--lg shadow--tl", styles.getStarted)}
          to={useBaseUrl("docs/category/getting-started/")}>
          Getting Started
        </Link>
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
        <CoverElement content={<CoverContent />} background="/assets/images/background.jpg" />
      </main>
    </Layout >
  );
}