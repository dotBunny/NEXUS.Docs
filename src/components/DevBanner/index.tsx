import type { ReactNode } from 'react';

export default function DevBanner({ }): ReactNode {
  return (
    <div className="devBanner">
      <div className="devBannerTitle"><span className="devBannerIcon-left">🚧</span>Under Development<span className="devBannerIcon-right">🚧</span></div>
      <div className="devBannerMessage">
        <p>The base of this functionality is currently only available in the <code><a href="https://github.com/dotBunny/NEXUS/tree/main">main</a></code> branch as it is in <strong>active</strong> development.</p>
        <p>Check out the <a href="/community/roadmap/">Roadmap</a>, or the work-in-process <a href="https://github.com/orgs/dotBunny/projects/6/views/1">Overwatch</a> board to see whats going on!</p>
      </div>
    </div>
  );
}