import type { ReactNode } from 'react';

export default function ImageMarkup({ imagePath, alt, top, left, width, height, text }): ReactNode {

  const highlightOverride = {
    top: top,
    left: left,
    width: width,
    height: height
  };

  return (
    <div className="pluginImageMarkup">
      <img src={imagePath} alt={alt} />
      <div className="highlight" style={highlightOverride}>
        <div className="description">{text}</div>
      </div>
    </div>
  );
}

/*

import ImageMarkup from '../../../../src/components/ImageMarkup';

<ImageMarkup 
  imagePath={require('./collision-visualizer-window.webp').default} 
  alt="Collision Viz Window" 
  top="10%" left="10%" width="50%" height="10%"
  text="Some text to show in the thing" />

*/