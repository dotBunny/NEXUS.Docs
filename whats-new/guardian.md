---
description: A highlight reel for the Guardian plugin and its additions over time.
---

# Guardian

## 0.4.0

### Build Availability Actually Works

`Build Availability` was supposed to keep Guardian out of Shipping by default. It didn't. A missing pair of parentheses
in the subsystem macro turned Guardian's "should I exist?" condition into "always", so 0.3.5 created
[`UNGuardianSubsystem`](/docs/guardian/types/guardian-subsystem) in **every** build. In Shipping, it took a baseline 15
seconds into every world and counted `UObject`s every second after that.

Fixed. **Expect Guardian to be absent** from every build its
[`Build Availability`](/docs/guardian/project-settings) excludes, which by default is Shipping. If something in your
Shipping build was calling into it, that code now needs to handle the subsystem not existing, which `Get()` returning
null already tells you.
