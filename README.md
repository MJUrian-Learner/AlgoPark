# 🧠 AlgoPark: DSA Visualization Web Application

**AlgoPark** is an interactive and educational web app designed to help users visualize and understand Data Structures and Algorithms (DSA) through dynamic animations, intuitive flowcharts, and hands-on experimentation. Perfect for students, educators, and developers aiming to deepen their DSA comprehension.

---

## 🎯 Project Objectives

- **Interactive Learning:** Enable visual experimentation with DS and algorithms.
- **Ease of Use:** Simple and intuitive UI for creating and manipulating structures.
- **Educational Value:** Animations to clarify operations and algorithmic flows.

---

## ✅ Core Features

### 1. User Input Management

- Input custom datasets for:
  - **Graphs:** Nodes, edges, weights
  - **Arrays:** Numeric sequences
  - **Trees:** Hierarchical structures

### 2. Data Structure Visualization

- Visual operations for:
  - Arrays (insert, delete, traverse)
  - Linked Lists (insert, delete, traverse)
  - Stacks (push, pop, peek)
  - Queues (enqueue, dequeue)
  - Binary Trees/BSTs (insert, delete, traversal)
  - Heaps (heapify, insert, delete)
  - Hash Tables (basic and collision handling)
  - Graphs (DFS, BFS, edge/node updates)
  - Tries (insert, search)

### 3. Algorithm Visualization

- Step-by-step visualizations for:
  - Bubble Sort, Merge Sort, Quick Sort
  - Binary Search
  - BFS / DFS
  - Dijkstra’s Algorithm
  - Prim’s & Kruskal’s MST
  - Heap Sort

### 4. Playback Controls

- Full playback control suite:
  - Play / Pause / Resume
  - Step forward/backward
  - Speed adjustment slider

### 5. Flowchart-Based Algorithm Builder

- Build custom algorithms via interactive canvas.
- Converts flowchart logic to animated execution steps.

### 6. Import/Export Functionality

- Save & load states (DS and algorithm setup)
- JSON file-based import/export

---

## 👤 User Stories (Sample)

- **Student:** Wants to input custom data to visualize specific cases.
- **Educator:** Needs step-wise control to pause and explain.
- **Developer:** Uses the flowchart builder to design and debug logic.

---

## 🔑 MVP Scope

### Must-Have Features:

- Core DS visualizations
- Top 10 algorithm visualizations
- Playback controls
- Custom dataset input
- Flowchart builder
- JSON import/export

### Nice-to-Have (Future):

- Account system & community sharing
- Advanced trees (AVL, Red-Black)
- Algorithm benchmarking tools
- Responsive UI for mobile

---

## 🛠 Tech Stack

| Layer                 | Stack                                                    |
| --------------------- | -------------------------------------------------------- |
| **Frontend**          | Vite + React + Tailwind CSS + React Flow + Framer Motion |
| **State Mgmt**        | Zustand (or Redux if needed)                             |
| **Backend**           | Go + Gin                                                 |
| **(Optional Future)** | Node.js + Express + PostgreSQL (for auth, storage)       |

---

## 🚀 Development Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```
