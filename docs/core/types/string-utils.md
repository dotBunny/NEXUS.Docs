---
sidebar_class_name: type native-class
description: Native string helpers — currently a pragmatic email-address shape check.
---

import TypeDetails from '@site/src/components/TypeDetails';

# String Utils

<TypeDetails icon="native-class" base="class" type="FNStringUtils" typeExtra="" headerFile="NexusCore/Public/NStringUtils.h" />

Header-only native string helpers. Everything is static, so there is nothing to construct.

## Is Valid Email

```cpp
static bool IsValidEmail(const FString& Email);
```

Returns `true` when the **whole** string is shaped like an ordinary email address: a local part of letters, digits and `._%+-`, an `@`, a domain of letters, digits, `.` and `-`, and a top-level domain of at least two letters.

It is deliberately pragmatic rather than full RFC 5322. Quoted local parts (`"john doe"@example.com`), IP-literal domains (`user@[192.0.2.1]`) and internationalized addresses are all rejected. Use it to catch typos in a sign-up field, not to decide whether an address can receive mail.

```cpp
FNStringUtils::IsValidEmail(TEXT("player@example.com"));   // true
FNStringUtils::IsValidEmail(TEXT("player@example"));       // false: no top-level domain
FNStringUtils::IsValidEmail(TEXT("player @example.com"));  // false: space in the local part
```
