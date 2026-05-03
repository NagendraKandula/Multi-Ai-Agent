# Multi-Ai-Agent
# 🧠 Gibber Link: Your AI Co-Founders, Ready to Work

**Built for the Agentic AI Hackathon 2026**

![Gibber Link Architecture](https://img.shields.io/badge/Status-Live-success) ![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E) ![React](https://img.shields.io/badge/Frontend-React-61DAFB) ![Mastra](https://img.shields.io/badge/Agent_Framework-Mastra-8B5CF6)

## 🚀 The Problem
In the early stages of a startup, a solo founder is expected to make critical, executive-level decisions across tech, marketing, and finance. However, they are usually operating alone in an echo chamber, lacking the bandwidth to be a world-class CTO, CMO, and CFO simultaneously. 

Founders don't fail because of bad ideas; they fail because of poor execution and a lack of constrained, diverse strategic planning.

## 💡 The Solution
**Gibber Link** is an autonomous, AI-powered boardroom simulation. We provide solo founders with a fractional, multi-agent executive team. 

Instead of building a simple chatbot, we built an **Autonomous Execution System**. Gibber Link doesn't just give you advice; it actively debates your startup constraints, synthesizes a strategic action plan, and autonomously executes the deliverables.

---

## ✨ Key Features

### 1. 🎭 Dynamic Boardroom Debates
Trigger an extreme debate phase where specialized agents (CTO, CFO, CMO) challenge each other's assumptions based on your startup's specific budget, timeline, and risk appetite. 

### 2. 🧠 Supervisor Agent Orchestration
Our architecture utilizes a "Supervisor" Agent that acts as the meeting chair. It dynamically evaluates the live context window and acts as a state router, deciding which specialized agent should speak next to ensure a natural, flowing conversation.

### 3. 📊 Structured Decision Summaries
Instead of leaving the founder with a messy chat log, the system aggregates the debate into a structured executive report featuring a viability score, strengths, concerns, and a concrete action plan.

### 4. ⚡ The Autonomous Execution Board (Thinking -> Doing)
The true power of Agentic AI. The founder can route specific action items to the specialized agents. The system provides transparency into the agent's "Thought Process" and generates real-world deliverables (e.g., Tech Stack Architectures, GTM Strategies, 18-Month Runway Budgets).

---

## 🏗️ System Architecture & Tech Stack

Our system is split into a robust backend API and a dynamic frontend client.

### Backend (Node.js & NestJS)
* **Framework:** NestJS
* **Agent Framework:** [Mastra](https://mastra.ai/) for multi-agent orchestration and memory management.
* **Architecture Design:** Master-Worker pattern. The Supervisor handles task routing and conflict resolution, while specialized nodes handle domain-specific reasoning and tool execution.
* **Deployment:** Render (`/backend`)

### Frontend (React.js)
* **Framework:** React.js (TypeScript)
* **Styling:** Modular CSS (`.module.css`) for scoped, clean UI design.
* **Exporting:** `html2canvas` and `jspdf` for exporting agent deliverables into professional PDF documents.
* **Deployment:** Vercel (`/frontend`)

---

## 🛠️ Local Setup & Installation

Follow these steps to run the Gibber Link simulation locally.

### Prerequisites
* Node.js (v22.17.1 recommended)
* npm or yarn

### 1. Clone the repository
```bash
git clone [https://github.com/NagendraKandula/Multi-Ai-Agent.git](https://github.com/NagendraKandula/Multi-Ai-Agent.git)
cd Multi-Ai-Agent
Here is a complete, highly professional README.md file for your GitHub repository. It is specifically designed to impress hackathon judges by highlighting the architecture, the Agentic AI features, and your tech stack.

You can copy and paste this directly into your README.md file at the root of your repository.

Markdown
# 🧠 Gibber Link: Your AI Co-Founders, Ready to Work

**Built for the Agentic AI Hackathon 2026**

![Gibber Link Architecture](https://img.shields.io/badge/Status-Live-success) ![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E) ![React](https://img.shields.io/badge/Frontend-React-61DAFB) ![Mastra](https://img.shields.io/badge/Agent_Framework-Mastra-8B5CF6)

## 🚀 The Problem
In the early stages of a startup, a solo founder is expected to make critical, executive-level decisions across tech, marketing, and finance. However, they are usually operating alone in an echo chamber, lacking the bandwidth to be a world-class CTO, CMO, and CFO simultaneously. 

Founders don't fail because of bad ideas; they fail because of poor execution and a lack of constrained, diverse strategic planning.

## 💡 The Solution
**Gibber Link** is an autonomous, AI-powered boardroom simulation. We provide solo founders with a fractional, multi-agent executive team. 

Instead of building a simple chatbot, we built an **Autonomous Execution System**. Gibber Link doesn't just give you advice; it actively debates your startup constraints, synthesizes a strategic action plan, and autonomously executes the deliverables.

---

## ✨ Key Features

### 1. 🎭 Dynamic Boardroom Debates
Trigger an extreme debate phase where specialized agents (CTO, CFO, CMO) challenge each other's assumptions based on your startup's specific budget, timeline, and risk appetite. 

### 2. 🧠 Supervisor Agent Orchestration
Our architecture utilizes a "Supervisor" Agent that acts as the meeting chair. It dynamically evaluates the live context window and acts as a state router, deciding which specialized agent should speak next to ensure a natural, flowing conversation.

### 3. 📊 Structured Decision Summaries
Instead of leaving the founder with a messy chat log, the system aggregates the debate into a structured executive report featuring a viability score, strengths, concerns, and a concrete action plan.

### 4. ⚡ The Autonomous Execution Board (Thinking -> Doing)
The true power of Agentic AI. The founder can route specific action items to the specialized agents. The system provides transparency into the agent's "Thought Process" and generates real-world deliverables (e.g., Tech Stack Architectures, GTM Strategies, 18-Month Runway Budgets).

---

## 🏗️ System Architecture & Tech Stack

Our system is split into a robust backend API and a dynamic frontend client.

### Backend (Node.js & NestJS)
* **Framework:** NestJS
* **Agent Framework:** [Mastra](https://mastra.ai/) for multi-agent orchestration and memory management.
* **Architecture Design:** Master-Worker pattern. The Supervisor handles task routing and conflict resolution, while specialized nodes handle domain-specific reasoning and tool execution.
* **Deployment:** Render (`/backend`)

### Frontend (React.js)
* **Framework:** React.js (TypeScript)
* **Styling:** Modular CSS (`.module.css`) for scoped, clean UI design.
* **Exporting:** `html2canvas` and `jspdf` for exporting agent deliverables into professional PDF documents.
* **Deployment:** Vercel (`/frontend`)

---

## 🛠️ Local Setup & Installation

Follow these steps to run the Gibber Link simulation locally.

### Prerequisites
* Node.js (v22.17.1 recommended)
* npm or yarn

### 1. Clone the repository
```bash
git clone [https://github.com/NagendraKandula/Multi-Ai-Agent.git](https://github.com/NagendraKandula/Multi-Ai-Agent.git)
cd Multi-Ai-Agent
2. Setup the Backend
Bash
cd backend
npm install
Create a .env file in the backend directory and add your required LLM API keys (e.g., OPENAI_API_KEY, GROQ_API_KEY).

Bash
npm run start:dev
The backend will run on http://localhost:4000

3. Setup the Frontend
Open a new terminal window:

Bash
cd frontend
npm install
Create a .env file in the frontend directory and link it to your backend:

Code snippet
REACT_APP_API_URL=http://localhost:4000
Bash
npm start
The frontend will run on http://localhost:3000

🤝 The Team
This project was built collaboratively for the Agentic AI Hackathon by:

Nagendra Kandula and Hemanth Kumar - Backend Architecture & Agent Orchestration
Meghana - Frontend Engineering & UI/UX
