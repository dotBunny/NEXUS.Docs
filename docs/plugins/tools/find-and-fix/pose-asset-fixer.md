---
sidebar_position: 1
description: An action to find and resolve UPoseAssets that are out-of-date with their source animation.
tags: [0.1.0]
---

# Pose Asset Fixer

## Outdated PoseAsset Source Animations

A particularly annoying error when cooking occurs when your `UPoseAsset` _throws_ because the saved hash of the source animation no longer matches the calculated source animation hash at the time of the cook. What makes this annoying is that the error only occurs during cooking because both assets are opened and evaluated. It's a latent error that content developers will not see outside of the build process.

```log
LogAnimation: Error: [CookWorker #]: PoseAsset <YourPoseAssetPath> is out-of-date with its source animation <YourAnimationAssetPath> <HashA> vs <HashB>
```

Found in the **Content Browser's** context menu `Find & Fix > Outdated PoseAsset Source Animations`, this command will scan your project's content for UPoseAssets and perform the check done when cooking. If the hashes do not match, it will update from the source animation automatically for you.

:::warning

This action will update/replace any different content related to the source animation, which could have unintended consequences. **Check the results!**

:::
