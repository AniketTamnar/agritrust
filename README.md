# AgriTrust

A comprehensive agricultural marketplace and management platform built to empower farmers, connect them with buyers, and provide AI-driven insights for better decision-making.

## 🌾 Overview

AgriTrust is a full-stack web application that combines modern web technologies with machine learning to create an end-to-end solution for agricultural stakeholders. The platform includes a marketplace for buying/selling agricultural products, farmer management tools, price forecasting using LSTM models, payment processing, and administrative oversight.

## ✨ Features

### 🏠 Dashboard
- Real-time statistics and analytics
- Price trend monitoring
- Farmer count and transaction summaries

### 👨‍🌾 Farmer Management
- Farmer registration and authentication
- Farm logs and activity tracking
- Personalized dashboards

### 🛒 Marketplace
- Product listings and categorization
- Shopping cart functionality
- Order management and tracking

### 💰 Payment Integration
- Secure payment processing with Razorpay
- Invoice generation and PDF downloads
- Transaction history

### 🤖 AI & ML Features
- Price prediction using LSTM neural networks
- AI-powered summaries and insights
- Weather forecasting integration
- Fertilizer distribution analytics

### 📊 Analytics & Charts
- Interactive price prediction charts
- Fertilizer distribution visualizations
- Market trend analysis

### 🔐 Security & Administration
- JWT-based authentication
- Rate limiting and security headers
- Admin panel for oversight
- Support ticket system

### 🌤️ Additional Features
- Weather live updates
- Blockchain ledger for transparency
- Government integration
- Community features

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Charts:** Chart.js
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt
- **Payments:** Razorpay
- **AI/ML:** OpenAI API
- **Security:** Helmet, CORS, Rate Limiting

### Machine Learning
- **Language:** Python
- **Framework:** TensorFlow/Keras (LSTM)
- **Data Processing:** Pandas, NumPy, Scikit-learn

### DevOps & Tools
- **Package Manager:** pnpm
- **Version Control:** Git
- **Deployment:** Vercel (frontend), Custom (backend)

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MongoDB
- pnpm package manager

### 1. Clone the Repository
```bash
git clone https://github.com/AniketTamnar/agritrust.git
cd agritrust
```

### 2. Frontend Setup
```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
pnpm dev
```

### 3. Backend Setup
```bash
cd farm-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Razorpay keys, etc.

# Start the server
node server.js
```

### 4. Python ML Environment Setup
```bash
cd farm-backend/ml/lstm

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train the model (if needed)
python trainLSTM.py

# The prediction API will be available through the backend
```

## 📝 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

### Backend (.env)
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/agritrust
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
OPENAI_API_KEY=your_openai_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## 🏃‍♂️ Usage

### Development
```bash
# Frontend
pnpm dev

# Backend (in separate terminal)
cd farm-backend && node server.js

# ML predictions (if running separately)
cd farm-backend/ml/lstm && python predictLSTM.py
```

### Production Build
```bash
# Frontend
pnpm build
pnpm start

# Backend
cd farm-backend && node server.js
```

## 📡 API Endpoints

The backend provides RESTful APIs for:

- **Authentication:** `/api/auth` (login, register, verify OTP)
- **Products:** `/api/products` (CRUD operations)
- **Orders:** `/api/orders` (order management)
- **Payments:** `/api/payment` (Razorpay integration)
- **Farm Logs:** `/api/farm-logs` (farmer activity)
- **Prices:** `/api/prices` (market prices)
- **AI/ML:** `/api/lstm` (price predictions), `/api/llm` (AI summaries)
- **Weather:** `/api/weather` (weather data)
- **Analytics:** `/api/count` (statistics)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Aniket Tamnar** - *Initial work* - [AniketTamnar](https://github.com/AniketTamnar)

## 🙏 Acknowledgments

- Radix UI for amazing component primitives
- OpenAI for AI capabilities
- Razorpay for payment processing
- The open-source community for inspiration and tools

---

Built with ❤️ for farmers and agricultural stakeholders worldwide.</content>
<parameter name="filePath">d:\AGRITRUST\AGRITRUST\AGRITRUST\README.md
