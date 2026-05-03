⚡ NexusAPI — Frontend
A premium usage-based API billing platform and gateway dashboard built with React, React Router, and standard CSS.

🌐 Live URL
https://nexusapi-frontend.vercel.app

🛠️ Tech Stack
| Technology | Purpose |
| --- | --- |
| React 18 | UI Framework |
| React Router v6 | Client-side Routing |
| Vanilla CSS | Styling (Custom Dark Amber Theme) |
| React Query | Server State & Caching |
| Axios | HTTP Client |
| Recharts | Analytics Charts & Visualizations |
| Lucide React | Icons |
| Vercel | Deployment |

✅ Features
🔐 Authentication
- Email/Password login & register
- Secure JWT token handling
- Protected routes
- Profile settings update

📊 Dashboard & Analytics
- Live API gateway metric summary
- Success rate, latency, and request counters
- Beautiful timeseries charts using Recharts
- Quick-copy Gateway URLs

🔑 API Key Management
- Generate secure API keys
- One-click copy functionality
- Revoke and rotate compromised keys
- View usage statistics per individual key

📝 Gateway Logs
- Real-time logging of all proxy requests
- View status codes, latencies, and requested paths
- Filter capabilities

💳 Billing & Subscriptions
- Tiered subscription management (Free, Starter, Pro, Enterprise)
- Real-time mock upgrade flows
- Dynamic rate limit upgrades

📱 UI/UX
- Premium Dark/Amber aesthetic
- Responsive design for mobile & desktop
- Smooth animations and intersection observers
- Interactive landing page with rolling ticker

📁 Project Structure
```text
src/
├── components/
│   ├── Navbar.jsx           # Main sidebar navigation
│   └── ProtectedRoute.jsx   # Auth guard for routes
├── context/
│   └── AuthContext.jsx      # Global authentication state
├── pages/
│   ├── Landing.jsx          # Public marketing page
│   ├── Landing.css          # Landing specific styles
│   ├── Login.jsx            # Sign in
│   ├── Register.jsx         # Create account
│   ├── Dashboard.jsx        # Main overview & charts
│   ├── ApiKeys.jsx          # Key generation & management
│   ├── Logs.jsx             # Real-time request logs
│   ├── Billing.jsx          # Subscription plans
│   └── Settings.jsx         # Profile management
├── services/
│   ├── api.js               # Axios instance configuration
│   ├── analyticsService.js  # Analytics endpoints
│   ├── authService.js       # Auth endpoints
│   └── keyService.js        # Key endpoints
├── App.js                   # Route configuration
└── index.css                # Global CSS variables & styling
```

🔧 Local Setup
```bash
# Clone
git clone https://github.com/shishvishwakarma995-png/nexusapi-frontend
cd nexusapi-frontend

# Install dependencies
npm install --legacy-peer-deps

# Create Environment file (.env)
REACT_APP_API_URL=http://localhost:5000/api

# Start Development Server
npm start

# Build for Production
npm run build
```

🔑 Environment Variables
```env
REACT_APP_API_URL=https://nexusapi-backend-vfhu.onrender.com/api
```

📱 Pages
| Route | Description |
| --- | --- |
| `/` | Interactive Landing page |
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | Main analytics dashboard |
| `/keys` | API Key management |
| `/logs` | Real-time proxy request logs |
| `/billing` | Upgrade subscription plans |
| `/settings` | Update user profile |

🚀 Deployment
- **Platform**: Vercel
- **Auto-deploy**: Push to `main` branch
- **Build command**: `npm run build`
- **Framework**: Create React App
