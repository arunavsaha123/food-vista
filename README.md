# 🍽️ Food Vista - Food Product Explorer

A modern web application to explore food products using the [OpenFoodFacts API](https://world.openfoodfacts.org/). Search, filter, and browse product details with a clean and responsive UI.

## 🚀 Live Demo

[Click here to view the live demo](https://food-vista-ten.vercel.app/)

## 📸 Screenshots

| Desktop View | Mobile View |
|--------------|-------------|
| ![Desktop](https://food-vista-ten.vercel.app/) | ![Mobile](https://food-vista-ten.vercel.app/) |

## 🔍 Features

- 🔎 **Search by product name**
- 📦 **Search by barcode**
- 🗂️ **Filter by category**
- ↕️ **Sort by product name & nutrition grade**
- 📄 **Product detail view with nutrition info & labels**
- 📱 **Responsive design for mobile and desktop**
- 🌗 **Optional dark mode support (if added)**

## 🛠️ Tech Stack

- **Frontend Framework**: React (with functional components & hooks)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Client**: Axios
- **Data Source**: OpenFoodFacts API
- **Deployment**: Vercel

## 🧠 Architecture Highlights

- Component-based design for better maintainability
- Clean separation of concerns (API, UI, logic)
- Optional: State management with Redux/Context API
- Optimized for performance and user experience
- Responsive and accessible design patterns

## 📁 Project Structure

```
food-vista/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── hooks/         # Custom React hooks
│   └── styles/        # Global styles and Tailwind config
├── public/            # Static assets
└── package.json       # Project dependencies
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/food-vista.git
cd food-vista
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenFoodFacts](https://world.openfoodfacts.org/) for providing the API
- All contributors who have helped improve this project
