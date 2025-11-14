# Yellow Developer Project: Loan Application Portal

## 🌟 Project Overview

This is a modern, responsive **Loan Application Portal** built using **Nuxt 3** for a robust, server-side rendered application. State management for the multi-step sign-up process is handled by **Pinia**. The UI uses **Tailwind CSS** and **shadcn-vue** components for a professional look, and all data persistence and authentication are managed via **Supabase** (PostgreSQL).

## 🚀 Tech Stack

| Technology | Purpose | Notes | 
 | ----- | ----- | ----- | 
| **Vue 3** | Frontend UI Framework | Composition API for logic. | 
| **Nuxt 3** | Full-Stack Framework | Routing and SSR. | 
| **Pinia** | State Management | Type-safe and modular store setup. | 
| **Tailwind CSS** | Styling | Utility-first design. | 
| **shadcn-vue** | UI Components | Accessible, customizable components. | 
| **Supabase** | Backend/Database | PostgreSQL, Auth, and APIs. | 

## 🛠️ Prerequisites

Before starting, ensure you have the following installed:

* **Node.js (v18+)**

* **pnpm** (The package manager used for this project)

* A **Supabase** account and project set up.

## ⚙️ Local Setup

### 1. Installation

Clone the repository and install dependencies using **pnpm**:

```git clone [YOUR_REPO_URL] cd [PROJECT_NAME] pnpm install```

### 2. Database Migration

The project relies on a specific PostgreSQL schema. You must run the provided migration script against your Supabase database before starting.

1. Navigate to your Supabase SQL Editor.

2. Open the file: `supabase/migrations/20251114124554_create_loan_tables.sql`

3. Copy and run the entire SQL content to create the necessary tables.

## 🔑 Key Project Files

The following files are essential to the application's core logic:

* **`components/signup/SignUpForm.vue`**: The main parent component orchestrating the multi-step sign-up and loan application flow.

* **`stores/loanApplication.ts`**: The Pinia store holding all application state, business logic, and managing interactions with the PostgreSQL backend (via Supabase).

* **`supabase/migrations/20251114124554_create_loan_tables.sql`**: The PostgreSQL schema definition required to structure the database for loan application data.

## 🏃 Getting Started

To run the development server:

```pnpm dev```

The application will be available at `http://localhost:3000`.