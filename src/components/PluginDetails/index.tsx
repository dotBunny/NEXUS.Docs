import type { ReactNode } from 'react';
import ContributorLink from '../ContributorLink'

interface IPlugin {
  icon: string;
  category: string;
  moduleName: string;
  shortName: string;
  initialRelease: string;
  owner: string;
  description: string;
  link: string;
  blueprintCategory: string;
}

var Plugins: { [id: string]: IPlugin; } = {

  "NexusCore": {
    icon: "/assets/images/plugins/core-icon.webp",
    moduleName: "NexusCore",
    shortName: "NCore",
    category: "N/A",
    initialRelease: "0.1.0",
    owner: "reapazor",
    description: "Functionality used by all NEXUS plugins in the framework.",
    link: "/docs/plugins/core/",
    blueprintCategory: ""
  },

  "NexusActorPools": {
    icon: "/assets/images/plugins/actor-pools-icon.webp",
    moduleName: "NexusActorPools",
    shortName: "NActorPools",
    category: "Systems",
    initialRelease: "0.1.0",
    owner: "reapazor",
    description: "Generalized pooling system for Actors.",
    link: "/docs/plugins/actor-pools/",
    blueprintCategory: "NEXUS > Actor Pools"
  },

  "NexusBlockout": {
    icon: "/assets/images/plugins/blockout.webp",
    moduleName: "NexusBlockout",
    shortName: "NBlockout",
    category: "Content",
    initialRelease: "0.2.0",
    owner: "reapazor",
    description: "A collection of useful content for blocking out a level or two early in development.",
    link: "/docs/plugins/blockout/",
    blueprintCategory: ""
  },

  "NexusDynamicRefs": {
    icon: "/assets/images/plugins/dynamic-references-icon.webp",
    moduleName: "NexusDynamicRef",
    shortName: "NDynamicRef",
    category: "Systems",
    initialRelease: "0.1.0",
    owner: "reapazor",
    description: "Method for referring to UObjects prior to runtime, and by developer readable names.",
    link: "/docs/plugins/dynamic-references/",
    blueprintCategory: "NEXUS > DynamicRef"
  },

  "NexusGuardian": {
    icon: "/assets/images/plugins/guardian-icon.webp",
    moduleName: "NexusGuardian",
    shortName: "NGuardian",
    category: "Systems",
    initialRelease: "0.2.7",
    owner: "reapazor",
    description: "A system which monitors metrics and takes action when thresholds are hit.",
    link: "/docs/plugins/guardian/",
    blueprintCategory: "NEXUS > Guardian"
  },

  "NexusMultiplayer": {
    icon: "/assets/images/plugins/multiplayer-icon.webp",
    moduleName: "NexusMultiplayer",
    shortName: "NMultiplayer",
    category: "Helpers",
    initialRelease: "0.1.0",
    owner: "reapazor",
    description: "Functionality and tools that are useful when developing multiplayer games.",
    link: "/docs/plugins/multiplayer/",
    blueprintCategory: "NEXUS > Multiplayer"
  },

  "NexusPicker": {
    icon: "/assets/images/plugins/picker-icon.webp",
    moduleName: "NexusPicker",
    shortName: "NPicker",
    category: "Helpers",
    initialRelease: "0.1.0",
    owner: "reapazor",
    description: "Selection functionality for points and other items.",
    link: "/docs/plugins/picker/",
    blueprintCategory: "NEXUS > Picker"
  },

  "NexusProcGen": {
    icon: "/assets/images/plugins/procedural-generation-icon.webp",
    moduleName: "NexusProcGen",
    shortName: "NProcGen",
    category: "Systems",
    initialRelease: "0.3.0",
    owner: "reapazor",
    description: "A procedural generation system focused on creating dynamic gameplay-focused spaces.",
    link: "/docs/plugins/procedural-generation/",
    blueprintCategory: "NEXUS > ProcGen"
  },

  "NexusTooling": {
    icon: "/assets/images/plugins/tooling-icon.webp",
    moduleName: "NexusTooling",
    shortName: "NTooling",
    category: "Editor",
    initialRelease: "0.2.7",
    owner: "reapazor",
    description: "An assortment of developer tools for the Unreal Editor.",
    link: "/docs/plugins/tooling/",
    blueprintCategory: ""
  },

  "NexusUserInterface": {
    icon: "/assets/images/plugins/ui-icon.webp",
    moduleName: "NexusUserInterface",
    shortName: "NUI",
    category: "Content",
    initialRelease: "0.1.0",
    owner: "reapazor",
    description: "Components for creating a user interface based on UMG/Slate.",
    link: "/docs/plugins/ui/",
    blueprintCategory: "NEXUS > User Interface"
  },
};


export default function PluginDetails({ moduleName, link, children }): ReactNode {

  const isLink: boolean = link ? true : false;
  const hasBlueprintCategory: boolean = (Plugins[moduleName].blueprintCategory.length > 0);
  var classes = 'pluginDetails';
  if (isLink) classes += ' pluginDetailsLink';

  const content = (
    <div className={classes}>
      <div className="pluginDetailsIcon">
        <img src={Plugins[moduleName].icon} alt={moduleName} />
      </div>
      <dl>
        <dt>Module Name:</dt>
        <dd>{moduleName} <span>/ {Plugins[moduleName].shortName}</span></dd>
        {!isLink && (
          <>
            <dt className="small-hide">Initial Release:</dt>
            <dd className="small-hide">{Plugins[moduleName].initialRelease}</dd>
          </>
        )}
        <dt>Description:</dt>
        <dd>{Plugins[moduleName].description}</dd>
        {(!isLink && hasBlueprintCategory) && (
          <>
            <dt className="small-hide">BP Category:</dt>
            <dd className="small-hide"><code>{Plugins[moduleName].blueprintCategory}</code></dd>
          </>
        )}
        {children}
        {!isLink && (
          <>
            <dt className="small-hide">Area Owner:</dt>
            <dd className="small-hide"><ContributorLink id={Plugins[moduleName].owner} /></dd>
          </>
        )}
      </dl>
    </div >
  );
  return isLink ? (
    <a href={Plugins[moduleName].link} className="pluginDetailsLink">
      {content}
    </a>
  ) : (
    content
  );
}