---
description: An automatic world or localspace grid with tint and line colors.
---

# Grid

An automatic world or localspace grid with tint and line colors, material instances (prefixed with `MI_NGrid_`).

:::tip

This material is **entirely** based off of the public works of [**Nick Mower**](https://techarthub.com/making-a-procedural-grid-material-in-unreal-engine/) and [**Ben Golus**](https://bgolus.medium.com/the-best-darn-grid-shader-yet-727f9278b9d8#56b0). Thanks to these two amazing developers for their efforts and willingness to share with the community! ♥️

:::

## Shades

<div class="image-thumbnails">
![MI_NGrid_White](/assets/images/docs/blockout/material-library/grid/grid-white.webp "MI_NGrid_White")
![MI_NGrid_Grey](/assets/images/docs/blockout/material-library/grid/grid-grey.webp "MI_NGrid_Grey")
![MI_NGrid_GreyDark](/assets/images/docs/blockout/material-library/grid/grid-grey-dark.webp "MI_NGrid_GreyDark")
![MI_NGrid_Black](/assets/images/docs/blockout/material-library/grid/grid-black.webp "MI_NGrid_Black")
</div>

## Colors

<div class="image-thumbnails">
![MI_NGrid_Blue](/assets/images/docs/blockout/material-library/grid/grid-blue.webp "MI_NGrid_Blue")
![MI_NGrid_Green](/assets/images/docs/blockout/material-library/grid/grid-green.webp "MI_NGrid_Green")
![MI_NGrid_Yellow](/assets/images/docs/blockout/material-library/grid/grid-yellow.webp "MI_NGrid_Yellow")
![MI_NGrid_Red](/assets/images/docs/blockout/material-library/grid/grid-red.webp "MI_NGrid_Red")
</div>

Also in this set: `MI_NGrid_Brown` and `MI_NGrid_BrownDark`, for ground that shouldn't read as grey.

## Finish Line

`MI_NGrid_FinishLine` sits at the **root** of the plugin's content rather than with the other instances. It is an `M_NGrid` instance with its checkerboard turned up (`Checkerboard Contrast` and `Checkerboard Scale` overridden), which makes it handy for marking a start, a goal, or a finish line.
