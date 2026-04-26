---
sidebar_position: 4
sidebar_label: Editor Utils
sidebar_class_name: type native-class
description: A utility methods collection for the Unreal Editor.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

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

/** Returns the union of folders selected in the Content Browser's main view and path view. */
static TArray<FString> GetSelectedContentBrowserPaths();
```

## Staging Helpers

```cpp
/** Marks Config so it will not be bundled with staged/packaged builds. */
static void DisallowConfigFileFromStaging(const FString& Config);

/** Marks Config so it will be bundled with staged/packaged builds (undoes DisallowConfigFileFromStaging). */
static void AllowConfigFileForStaging(const FString& Config);
```

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
```
