# 💰 Ledgerly - Mindful Spending, Peaceful Finances

<div align="center">

![Ledgerly](https://img.shields.io/badge/Ledgerly-v2.0.0-D4C5A0?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite)

**Track expenses with elegance. Smart insights, beautiful design, peaceful finances.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage)

</div>

---

## ✨ Features

### 🎯 Core Features
- **Smart Expense Tracking** - Add, edit, and categorize expenses with ease
- **Receipt OCR Scanning** 📸 - Scan receipts with camera or upload images
- **AI-Powered Insights** - Discover spending patterns and get personalized recommendations
- **Advanced Filtering** 🔍 - Multi-criteria search and filter system
- **Budget Management** - Set category-specific budgets and track progress in real-time
- **Financial Goals** - Create and monitor savings targets with visual progress tracking
- **Recurring Expenses** 🔄 - Automate regular payments and subscriptions
- **Calendar View** 📅 - Interactive monthly calendar with daily spending
- **Comparison Analytics** 📊 - 6-month trends and category comparisons
- **Theme Toggle** 🌓 - Dark/Light mode with smooth transitions
- **Notification System** 🔔 - Real-time alerts and notification center
- **Data Import/Export** 📥📤 - Full data portability with JSON/CSV support
- **Interactive 3D UI** - Stunning glassmorphism effects with Three.js animations
- **Real-time Analytics** - Beautiful charts and visualizations using Recharts

### 🧠 Smart Insights Engine
- **Weekend Spending Analysis** - Discover how your spending varies by day
- **Unusual Expense Detection** - Get alerted to abnormal spending patterns
- **Recurring Pattern Recognition** - Automatically identify recurring expenses
- **Budget Warnings** - Proactive alerts when approaching limits
- **Savings Opportunities** - Smart suggestions to reduce unnecessary spending
- **Achievement Tracking** - Celebrate when you meet financial goals

### 📊 Advanced Analytics
- Category breakdown with interactive pie charts
- Daily spending trends with line graphs
- Top spending categories with bar charts
- Month-over-month comparison
- Average daily spending calculator

### 💾 Export & Reporting
- Export data to JSON format
- Generate CSV spreadsheets for Excel
- Create detailed text reports
- Backup and restore functionality

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for blazing-fast build tooling
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations

### 3D & Visualization
- **Three.js** for 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **Recharts** for data visualization

### State Management
- **Zustand** with persistence middleware
- Local storage for data persistence

### Utilities
- **date-fns** for date manipulation
- **Lucide React** for beautiful icons

---

## 🚀 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser with WebGL support

### Setup

1. **Clone or navigate to the project directory**
```bash
cd "d:\New folder\Mini project"
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

5. **Preview production build**
```bash
npm run preview
```

---

## 📖 Usage

### Adding an Expense
1. Click the **"Add Expense"** button in the header
2. Fill in the expense details:
   - Amount
   - Category (choose from 13 predefined categories)
   - Description
   - Date
   - Payment method
   - Optional: Location and tags
3. Click **"Add Expense"** to save

### Setting a Budget
1. Navigate to the **"Budgets"** tab
2. Click **"Add Budget"**
3. Select category, set limit, and choose period (daily/weekly/monthly/yearly)
4. Track progress with visual indicators

### Creating Financial Goals
1. Go to the **"Goals"** tab
2. Click **"Add Goal"**
3. Enter goal details (name, target amount, deadline, priority)
4. Monitor progress with percentage indicators

### Viewing Insights
- Smart insights appear automatically in the right panel
- Insights include:
  - Spending patterns
  - Budget warnings
  - Savings suggestions
  - Achievements

---

## 🧮 DSA Implementation

This project implements advanced Data Structures and Algorithms to power the smart insights engine:

### 1. **Custom HashMap** (`ExpenseHashMap`)
**Purpose**: Efficient expense categorization and aggregation

**Implementation**:
```typescript
class ExpenseHashMap<K, V> {
  private buckets: Map<K, V[]>;
  // O(1) average insertion and retrieval
  set(key: K, value: V): void
  get(key: K): V[]
  getTotalByKey(key: K): number
}
```

**Use Cases**:
- Group expenses by category
- Calculate category totals
- Fast lookup of expenses by any property

**Time Complexity**: O(1) average for insert/lookup

---

### 2. **Max Heap** (`MaxHeap`)
**Purpose**: Find top spending categories efficiently

**Implementation**:
```typescript
class MaxHeap<T> {
  private heap: T[];
  insert(value: T): void        // O(log n)
  extractMax(): T | null        // O(log n)
  peek(): T | null              // O(1)
}
```

**Use Cases**:
- Identify top 5 spending categories
- Priority-based budget alerts
- Goal prioritization

**Time Complexity**: 
- Insert: O(log n)
- Extract Max: O(log n)
- Peek: O(1)

---

### 3. **Spending Graph** (`SpendingGraph`)
**Purpose**: Discover spending relationships and correlations

**Implementation**:
```typescript
class SpendingGraph {
  private adjacencyList: Map<string, Map<string, number>>;
  addEdge(from: string, to: string, weight: number): void
  getRelatedCategories(category: string): Array<{...}>
  getStrongestConnections(limit: number): Array<{...}>
}
```

**Use Cases**:
- Find categories that are frequently spent together
- Discover spending patterns (e.g., "When you eat out, you also spend on transportation")
- Predict future spending based on correlations

**Time Complexity**: O(V + E) for traversal

---

### 4. **Smart Insights Engine**
Combines all DSA structures to generate actionable insights:

**Algorithms**:
- **Pattern Detection**: Statistical analysis of spending by time (weekends vs weekdays)
- **Anomaly Detection**: Standard deviation-based unusual expense identification
- **Frequency Analysis**: Time-series analysis for recurring expenses
- **Predictive Analytics**: Trend analysis for budget forecasting

---

## 🎨 UI/UX Features

### Glassmorphism Design
- Frosted glass effect with backdrop blur
- Semi-transparent cards with vibrant gradients
- Smooth shadows and borders

### 3D Elements
- Animated particle fields
- Floating geometric shapes
- Interactive background scene
- Smooth camera controls

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

### Animations
- Framer Motion for smooth transitions
- Hover effects and micro-interactions
- Loading states and skeleton screens

---

## 📊 Data Persistence

All data is stored locally using Zustand's persistence middleware:
- Expenses
- Budgets
- Financial goals
- User preferences

**Storage**: Browser's localStorage
**Format**: JSON with automatic serialization/deserialization

---

## 🔒 Privacy

- **100% Client-Side**: All data stays on your device
- **No Server**: No data transmission to external servers
- **No Tracking**: No analytics or tracking scripts
- **Open Source**: Transparent code you can audit

---

## 🎯 Future Enhancements

- [ ] Receipt OCR scanning with Tesseract.js
- [ ] Multi-currency support
- [ ] Recurring expense automation
- [ ] Bank account integration
- [ ] Mobile app (React Native)
- [ ] Dark/Light theme toggle
- [ ] Custom categories
- [ ] Expense sharing with family
- [ ] Tax calculation helpers
- [ ] Investment tracking

---

## 👨‍💻 Developer

**Developed with ❤️ by Rushan Haque**

- 🎓 B.Tech in Computer Science - Internet of Things
- 📍 India

### Connect with me:
- [LinkedIn](https://www.linkedin.com/in/rushan-haque)
- [Instagram](https://www.instagram.com/rushan.haque)
- [GitHub](https://github.com/rushanhaque)
- [Email](mailto:rushan@example.com)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- 3D graphics powered by [Three.js](https://threejs.org/)
- Charts by [Recharts](https://recharts.org/)
- Inspired by Mint and YNAB

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with passion and lots of ☕

</div>
