---
sidebar_position: 2
sidebar_label: Game User Settings Library
sidebar_class_name: type ue-blueprint-function-library
description: A small collection of functionality to help with presentation/selection of Game User Settings.
tags: [0.2.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';

# Game User Settings Library

<TypeDetails icon="ue-blueprint-function-library" base="UBlueprintFunctionLibrary" type="UNGameUserSetttingsLibrary" typeExtra="" headerFile="NexusUI/Public/NGameUserSetttingsLibrary.h" />

 A small collection of functionality to help with presentation/selection of Game User Settings.

## UFunctions

### Video

#### Get WindowMode From Selection (String)

```cpp
/**
  * Get the associated EWindowMode::Type for the provided FString.
  * @remark The string should be generated from this library's functionality.
  * @param Selection The string to find an enumeration for.
  * @return The corresponding EWindowMode::Type.
  */
static EWindowMode::Type GetWindowModeFromString(const FString& Selection);
```  

#### Get WindowMode From Selection (Text)

```cpp
/**
  * Get the associated EWindowMode::Type for the provided FText.
  * @remark The FText should be generated from this library's functionality.
  * @param Selection The FText to find an enumeration for.
  * @return The corresponding EWindowMode::Type.
  */
static EWindowMode::Type GetWindowModeFromText(const FText& Selection);
```

#### Get Current WindowMode (String)

```cpp
/**
* Get the current window modes selection FString.
* @return The cached FString representing the current EWindowMode::Type.
*/
static FString& GetSelectionStringFromCurrentWindowMode();
```

#### Get Current WindowMode (Text)

```cpp
/**
  * Get the current window modes selection FText.
  * @return The cached FText representing the current EWindowMode::Type.
  */
static FText& GetSelectionTextFromCurrentWindowMode();
```  

#### Get Selection From WindowMode (String)

```cpp
/**
  * Get the cached selection string from a EWindowMode::Type.
  * @param Mode the EWindowMode::Type to find the associated FString for.
  * @return The cached FString representing the target EWindowMode::Type. 
  */
static FString& GetSelectionStringFromWindowMode(EWindowMode::Type Mode);
```  

#### Get Selection From WindowMode (Text)

```cpp
/**
  * Get the cached selection text from a EWindowMode::Type.
  * @param Mode the EWindowMode::Type to find the associated FText for.
  * @return The cached FText representing the target EWindowMode::Type. 
  */
static FText& GetSelectionTextFromWindowMode(EWindowMode::Type Mode);
```  

#### Get WindowMode Selections (String)

```cpp
/**
  * Get the cached EWindowMode::Type selection FStrings.
  * @return The FString array holding the different cached selection strings.
  */
static TArray<FString>& GetWindowModeStringSelections() { return DisplayModeLabels; };
```  

#### Get WindowMode Selections (Text)

```cpp
/**
  * Get the cached EWindowMode::Type selection FTexts.
  * @return The FTexts array holding the different cached selection strings.
  */
static TArray<FText>& GetWindowModeTextSelections() { return DisplayModeTexts; };
```

#### Get Selection From Current Display Resolution

```cpp
/**
  * Get the selection string from the current display resolution.
  * @return A FString representing the resolution.
  */
static FString GetSelectionFromCurrentDisplayResolution();
```

#### Get Selection From Display Resolution

```cpp
/**
  * Get the selection string from the current display resolution.
  * @return A FString representing the resolution.
  */	
static FString GetSelectionFromDisplayResolution(FIntPoint Resolution);
```  

#### Get Display Resolution From Selection

```cpp
/**
  * Get the display resolution from a selection string.
  * @param Selection A FString representing a display resolution (Width x Height)
  * @return A display resolution as a FIntPoint.
  */
static FIntPoint GetDisplayResolutionFromSelection(const FString& Selection);
```

#### Get Supported Display Resolutions

```cpp
/**
* Gets the supported display resolutions for the current platform as strings.
* @return An array of FStrings containing all supported resolutions.
*/
static TArray<FString> GetSupportedDisplayResolutions();
```  

### Initialize

#### Initialize WindowMode Selector (NComboBoxString)

```cpp
/**
  * Clears and populates a NComboBoxString with the selectable WindowMode types. 
  * @param ComboBox Target combobox to fill and setup.
  * @param bSelectCurrent Should the currently used WindowMode be selected?
  */
static void InitializeWindowModeComboBoxString(UNComboBoxString* ComboBox, const bool bSelectCurrent = true);
```  

#### Initialize Display Resolution Selector (NComboBoxString)

```cpp
/**
* Clears and populates a NComboBoxString with the selectable Display Resolutions. 
* @param ComboBox Target combobox to fill and setup.
* @param bSelectCurrent Should the current display resolution be selected?
*/
static void InitializeDisplayResolutionComboBoxString(UNComboBoxString* ComboBox, const bool bSelectCurrent = true);
```

