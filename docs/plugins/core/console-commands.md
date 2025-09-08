---
sidebar_position: 9
description: Some console commands for developers to use provided by NCore.
---

# Console Commands

Some console commands for developers to use provided by NCore.

## Developer

|Command|Description|Flag(s)|Shippable|
|:--|:--|:--|:--|
|`N.Developer.Snapshot`|Take a snapshot of the currently known objects and save to the projects log folder.|`ECVF_Default`|`Yes`|
|`N.Developer.CacheSnapshot`|Caches a snapshot to be compared against manually via `N.Developer.CompareSnapshot`|`ECVF_Default`|`Yes`|
|`N.Developer.CompareSnapshot`|Compares the a current snapshot to the previously cached one and outputs results to disk.|`ECVF_Default`|`Yes`|
|`N.Developer.ClearCachedSnapshot`|Clears the cached snapshot.|`ECVF_Default`|`Yes`|
