---
sidebar_label: Meta Utils
sidebar_class_name: type native-class
description: A set of utility functions related to accessing meta-information from graphs, nodes, classes, etc. accessed natively.
tags: [0.1.0]
---

import TypeDetails from '../../../../src/components/TypeDetails';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Meta Utils

<TypeDetails icon="native-class" base="class" type="FNMetaUtils" typeExtra="" headerFile="NexusCoreEditor/Public/NMetaUtils.h" />

A set of utility functions related to accessing meta-information from graphs, nodes, classes, etc. accessed natively.

## Methods

### Key Check

Numerous options to determining if a given `UObject` variant has the specified meta key.

```cpp
static bool HasKey(UEdGraphNode* Node, const FName& Key);
static bool HasKey(const UScriptStruct* ScriptStruct, const FName& Key);
static bool HasKey(const UStruct* Struct, const FName& Key);
static bool HasKey(const UClass* Class, const FName& Key);
```

### Get Data

Numerous ways to extract the `FString` from a given `UObject` variant's specified key.

```cpp
static FString GetData(UEdGraphNode* Node, const FName& Key);
static FString GetData(const UScriptStruct* ScriptStruct, const FName& Key);
static FString GetData(const UStruct* Struct, const FName& Key);
static FString GetData(const UClass* Class, const FName& Key);

static bool TryGetData(UEdGraphNode* Node, const FName& Key, FString& OutValue);
static bool TryGetData(const UScriptStruct* ScriptStruct, const FName& Key, FString& OutValue);
static bool TryGetData(const UStruct* Struct, const FName& Key, FString& OutValue);
static bool TryGetData(const UClass* Class, const FName& Key, FString& OutValue);

static FString GetDataUnsafe(UEdGraphNode* Node, const FName& Key);
static FString GetDataUnsafe(const UScriptStruct* ScriptStruct, const FName& Key);
static FString GetDataUnsafe(const UStruct* Struct, const FName& Key);
static FString GetDataUnsafe(const UClass* Class, const FName& Key);
```

:::warning

`Unsafe` methods access the data without checking if the key exists.

:::

## Macros

As an added bonus, included are a set of macros to optimize the access of a predetermined key.

:::info

You must use both macros, `N_IMPLEMENT_META_TYPE_HEADER` and `N_IMPLEMENT_META_TYPE` for the functionality to compile.

:::

### N_IMPLEMENT_META_TYPE_HEADER

Passing in the method prefix to this macro will produce a series of simple static functions to call related to the provided prefix (the key will be setup on the implementation side).

```cpp title="Macro Usage"
N_IMPLEMENT_META_TYPE_HEADER(ExternalDocumentation)
```

```cpp title="Expansion Preview"
public:
	static bool HasExternalDocumentation(UEdGraphNode* Node)
	{
		return FNMetaUtils::HasKey(Node, ExternalDocumentationKey);
	}

	static FString GetExternalDocumentation(UEdGraphNode* Node)
	{
		return FNMetaUtils::GetData(Node, ExternalDocumentationKey);
	}

	static FString GetExternalDocumentationUnsafe(UEdGraphNode* Node)
	{
		return FNMetaUtils::GetDataUnsafe(Node, ExternalDocumentationKey);
	}

	static bool TryGetExternalDocumentation(UEdGraphNode* Node, FString& OutValue)
	{
		return FNMetaUtils::TryGetData(Node, ExternalDocumentationKey, OutValue);
	};

	static bool HasExternalDocumentation(UScriptStruct* ScriptStruct)
	{
		return FNMetaUtils::HasKey(ScriptStruct, ExternalDocumentationKey);
	}

	static FString GetExternalDocumentation(UScriptStruct* ScriptStruct)
	{
		return FNMetaUtils::GetData(ScriptStruct, ExternalDocumentationKey);
	}

	static FString GetExternalDocumentationUnsafe(UScriptStruct* ScriptStruct)
	{
		return FNMetaUtils::GetDataUnsafe(ScriptStruct, ExternalDocumentationKey);
	}

	static bool TryGetExternalDocumentation(UScriptStruct* ScriptStruct, FString& OutValue)
	{
		return FNMetaUtils::TryGetData(ScriptStruct, ExternalDocumentationKey, OutValue);
	};

	static bool HasExternalDocumentation(UStruct* Struct)
	{
		return FNMetaUtils::HasKey(Struct, ExternalDocumentationKey);
	}

	static FString GetExternalDocumentation(UStruct* Struct)
	{
		return FNMetaUtils::GetData(Struct, ExternalDocumentationKey);
	}

	static FString GetExternalDocumentationUnsafe(UStruct* Struct)
	{
		return FNMetaUtils::GetDataUnsafe(Struct, ExternalDocumentationKey);
	}

	static bool TryGetExternalDocumentation(UStruct* Struct, FString& OutValue)
	{
		return FNMetaUtils::TryGetData(Struct, ExternalDocumentationKey, OutValue);
	};
	static bool HasExternalDocumentation(UClass* Class) { return FNMetaUtils::HasKey(Class, ExternalDocumentationKey); }

	static FString GetExternalDocumentation(UClass* Class)
	{
		return FNMetaUtils::GetData(Class, ExternalDocumentationKey);
	}

	static FString GetExternalDocumentationUnsafe(UClass* Class)
	{
		return FNMetaUtils::GetDataUnsafe(Class, ExternalDocumentationKey);
	}

	static bool TryGetExternalDocumentation(UClass* Class, FString& OutValue)
	{
		return FNMetaUtils::TryGetData(Class, ExternalDocumentationKey, OutValue);
	};

private:
	static FName ExternalDocumentationKey;
```

### N_IMPLEMENT_META_TYPE

In your implementation side of the class you utilize this macro to define the key that the previous macro searches for.

```cpp title="Macro Usage"
N_IMPLEMENT_META_TYPE(ExternalDocumentation, DocsURL)
```

```cpp title="Expansion Preview"
FName FNMetaUtils::ExternalDocumentationKey = FName(L"DocsURL");
```
