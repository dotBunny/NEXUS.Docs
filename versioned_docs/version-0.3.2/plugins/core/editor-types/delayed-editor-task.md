---
sidebar_class_name: type ue-object
description: An abstract class designed to encompass work to be completed at some level of delay from the time of its creation.
---

import TypeDetails from '@site/src/components/TypeDetails';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Delayed Editor Task

<TypeDetails icon="ue-object" base="UObject" type="UNDelayedEditorTask" typeExtra="" headerFile="NexusCoreEditor/Public/NDelayedEditorTask.h" />

An **abstract**  class designed to encompass work to be completed at some level of delay from the time of its creation.

For implementation examples look at `NLeakTestDelayedEditorTask` or `NUpdateCheckDelayedEditorTask`.