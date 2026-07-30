---
sidebar_class_name: type native-class
description: A utility methods collection for the Unreal Editor.
---

import TypeDetails from '@site/src/components/TypeDetails';

# Editor Utils

<TypeDetails icon="native-class" base="class" type="FNEditorUtils" typeExtra="" headerFile="NexusCoreEditor/Public/NEditorUtils.h" />

A utility methods collection for the Unreal Editor. Native-only; for the Blueprint surface see [`Editor Library`](editor-library.md).

## Editor State

```cpp
/** Indicates if the editor is in a shutdown process. */
FORCEINLINE static bool IsEditorShuttingDown();

/** Are any Actors selected in the editor currently? */
FORCEINLINE static bool HasActorsSelected();

/** Get the current editor map name. */
FORCEINLINE static FString GetCurrentMapName();

/** Get the current editor map full path. */
FORCEINLINE static FString GetCurrentMapFullPath();
```

## PIE State

```cpp
/** Is in PIE mode. */
FORCEINLINE static bool IsPlayInEditor();

/** Is not in PIE mode. */
FORCEINLINE static bool IsNotPlayInEditor();

/** Is in PIE and not paused. */
FORCEINLINE static bool IsPlayInEditorRunning();

/**
 * Is the editor controlled by a user?
 * @note Attempts to represent if it is safe to do things that need a fully initialized editor.
 */
FORCEINLINE static bool IsUserControlled();
```

## Settings Registration

```cpp
/** Register a UDeveloperSettings object with the Unreal Editor. */
static void RegisterSettings(UDeveloperSettings* SettingsObject);

/** Unregister a UDeveloperSettings object with the Unreal Editor. */
static void UnregisterSettings(const UDeveloperSettings* SettingsObject);
```

## Asset Editors

```cpp
/** Get the currently selected asset editor. */
static IAssetEditorInstance* GetForegroundAssetEditor();

/** Create a new Blueprint asset of the specified class at the given path. */
static UBlueprint* CreateBlueprint(const FString& InPath, const TSubclassOf<UObject>& InParentClass);
```

## Viewport / Level / World

```cpp
/** Returns the active editor viewport's client. */
FORCEINLINE static FEditorViewportClient* GetActiveViewportClient();

/** Returns the current editor level (nullptr while PIE is active). */
FORCEINLINE static ULevel* GetCurrentLevel();

/** Returns the world that owns the current editor level. */
FORCEINLINE static UWorld* GetCurrentWorld();

/** Tests whether World has never been saved (new map or in-memory only). */
FORCEINLINE static bool IsUnsavedWorld(const UWorld* World);

/** Replaces the current actor selection with Actor. */
FORCEINLINE static void SelectActor(AActor* Actor);

/** @return true/false if a single actor is selected. */
FORCEINLINE static bool HasActorSelected();

/** Returns the union of folders selected in the Content Browser's main view and path view. */
static TArray<FString> GetSelectedContentBrowserPaths();
```

## Staging Helpers

```cpp
/** Marks Config so it will not be bundled with staged/packaged builds. */
static void DisallowConfigFileFromStaging(const FString& Config);

/** Marks Config so it will be bundled with staged/packaged builds (undoes DisallowConfigFileFromStaging). */
static void AllowConfigFileForStaging(const FString& Config);

/**
 * Adds RelativeConfig to AddArrayKey and prunes it from RemoveArrayKey within ConfigFile's [Staging]
 * section, so a config never lingers in both lists. Operates purely on ConfigFile — no disk I/O.
 * @param ConfigFile The config to mutate in place.
 * @param RelativeConfig The project-relative ini path to add (e.g. "NEXUS/Config/Foo.ini").
 * @param AddArrayKey The Staging array to add RelativeConfig to.
 * @param RemoveArrayKey The opposing Staging array to prune RelativeConfig from.
 * @return true if ConfigFile was modified.
 */
static bool ApplyStagingConfigEntry(FConfigFile& ConfigFile, const FString& RelativeConfig,
    const TCHAR* AddArrayKey, const TCHAR* RemoveArrayKey);
```

The two `*ForStaging` helpers above are the ones to reach for normally. `ApplyStagingConfigEntry` is the primitive underneath them: it edits an in-memory `FConfigFile` and performs **no disk I/O**, so the caller owns writing the result. Its value is the paired add/prune — passing the opposing array key as `RemoveArrayKey` guarantees a config cannot end up listed as both staged and unstaged.

## Workspace / Tabs

```cpp
/** Registers or replaces a global workspace item under WidgetIdentifier. */
static void UpdateWorkspaceItem(const FName& WidgetIdentifier, const FText& Label, const FSlateIcon& Icon);

/** Unregisters the workspace item previously added under WidgetIdentifier. */
static void RemoveWorkspaceItem(const FName& WidgetIdentifier);

/** Registers a callback that fires when the tab with TabIdentifier is closed. */
static void SetTabClosedCallback(const FName& TabIdentifier, const SDockTab::FOnTabClosedCallback& OnTabClosedCallback);
```

## Misc

```cpp
/** Returns the absolute path to Engine/Binaries. */
FORCEINLINE static FString GetEngineBinariesPath();

/** Deletes the contents of the project's Saved/Logs folder. */
static void CleanLogsFolder();

/**
 * Resolves an asset to the package file backing it on disk.
 * @param Asset Asset whose owning package to locate; may be null.
 * @return The full, absolute path to the package file, or an empty string if Asset is null or no file exists.
 */
static FString GetAssetPathOnDisk(const UObject* Asset);
```

`GetAssetPathOnDisk` tolerates a null `Asset` and returns an empty string rather than asserting — and also returns empty for an asset with no file yet on disk, such as a newly created package that has never been saved. Check for the empty string rather than assuming a path.
