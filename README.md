# ⚡ NexusAPI - Frontend

The beautiful, modern React dashboard for **NexusAPI**. It allows developers to register their backend APIs, generate and rotate API keys, view live traffic analytics, and manage their subscription plans.

## 🚀 Tech Stack
- **Framework**: React.js (Create React App)
- **Routing**: React Router DOM
- **Data Fetching**: Axios & React Query (@tanstack/react-query)
- **Charts**: Recharts
- **Styling**: Vanilla CSS (Custom modern design system)

## ✨ Core Features
- **Live Analytics Dashboard**: Visualizes API traffic volume, success rates, and latency using dynamic area charts.
- **API Registry**: Allows users to register downstream API endpoints to be proxied.
- **Key Management**: Generate secure API keys, revoke compromised keys, and automatically rotate keys.
- **Request Logs**: View a historical, searchable table of every request made through the gateway.
- **Billing & Subscriptions**: Upgrade plans to unlock higher rate limits and monthly quotas.
- **Profile Settings**: Manage account details and security.

## 🛠️ Environment Variables

To run this project locally, create a `.env` file in the root directory (or just use the default fallback):

```env
REACT_APP_API_URL=http://localhost:5000/api
```
*(In production, this should point to your deployed backend API URL, e.g., `https://nexusapi-backend.onrender.com/api`)*

## 📦 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. The app will open at `http://localhost:3000`.

## 🎨 Design Philosophy
This UI was built completely from scratch without component libraries like Tailwind or Material UI. It utilizes a custom CSS design system (`index.css`) featuring glassmorphism, subtle micro-animations, and a highly polished layout to deliver a premium developer experience.
