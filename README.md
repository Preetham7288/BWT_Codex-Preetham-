### **Hackathon Theme:**

##### 

#### AI Super Productivity – Build for Focus \& Flow

#### Category: The Interrupted Developer



### 

#### **FlowGuard AI**

#### **Cognitive Continuity Engine for Developers**



#### **Overview:**

##### 

##### FlowGuard AI is a productivity tool designed to help developers stay focused in interruption-heavy environments.

##### 

##### Developers often switch between coding, meetings, messages, and debugging. These interruptions break their flow and make it hard to resume work quickly.

##### 

##### FlowGuard saves the working context and restores it when the developer returns.

##### 

#### **Problem Statement:**

##### 

##### Frequent interruptions cause developers to lose mental context.

##### 

##### **When they come back to work, they must:**

1. ##### Remember what they were building
2. ##### Re-check unfinished code
3. ##### Re-open related files
4. ##### Recall why certain decisions were made

##### 

##### This wastes time and reduces productivity.

##### 

#### **Solution Overview:**

##### 

##### FlowGuard AI works as a background assistant that:

##### 

* ##### Tracks active files and coding activity
* ##### Captures session context
* ##### Generates an AI-powered summary when work pauses
* ##### Restores that summary when the developer returns
* ##### Suggests next steps to continue work

##### 

##### This reduces context recovery time and helps developers return to deep work faster.

##### 

#### **Architecture:**

##### 

##### FlowGuard AI follows a modular architecture built using Trae AI during the hackathon.

##### 

#### **1. VS Code Extension Layer:**

* ##### Built using Trae AI-generated boilerplate
* ##### Tracks active files, edits, and navigation
* ##### Detects inactivity or manual session pause
* ##### Sends structured session data to backend API

##### 

#### **2. Backend Layer:**

* ##### Developed using Trae AI assistance
* ##### Receives session context from extension
* ##### Structures and stores session data
* ##### Sends formatted context to AI engine for summarization

##### 

#### **3. Trae AI / LLM Integration Layer:**

* ##### Uses Trae Pro AI capabilities
* ##### Generates concise session summaries
* ##### Identifies incomplete logic
* ##### Suggests probable next steps
* ##### Returns structured output to backend

##### 

#### **4. Storage Layer:**

* ##### Stores session snapshots and AI-generated summaries
* ##### Maintains session history for restoration

##### 

#### **5. Flow Restoration Dashboard:**

* ##### Simple React-based interface
* ##### Displays previous session summary
* ##### Highlights unfinished work
* ##### Guides the developer to resume quickly

##### 

#### **Tech Stack (Planned):**

##### 

1. ##### VS Code API
2. ##### Node.js / Python
3. ##### LLM-based AI summarization
4. ##### React (for dashboard UI)
5. ##### Lightweight database
