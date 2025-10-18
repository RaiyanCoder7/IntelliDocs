🦉 Overview

Owl AI is an intelligent research assistant designed to help researchers, students, and knowledge workers collect, organize, and extract valuable insights from their documents and notes. With AI-powered features, Owl AI transforms how you manage and analyze your research materials.

✨ Features

🏠 Home & Authentication

· Modern Landing Page: Engaging introduction to Owl AI's capabilities
· User Authentication: Secure login and registration system
· Get Started Free: Easy onboarding for new users

📊 Dashboard & Document Management

· Smart Document Management: Organize research papers, notes, and documents
· AI-Powered Categorization: Automatic tagging and organization
· Quick Actions Panel:
  · Create new documents
  · Upload files (PDFs, text documents)
  · Access AI analysis tools
  · Application settings

🔍 Advanced Search & Analysis

· Semantic Search: Find content using context-aware search that understands meaning
· AI-Powered Insights:
  · Automatic Summaries: Generate concise document summaries
  · Key Point Extraction: Identify and extract main ideas
  · Sentiment Analysis: Analyze tone and emotional content
  · Full Analysis: Comprehensive insights in one click

📁 Document Organization

· Categorized document storage (Research, Articles, etc.)
· File type support including PDFs
· Upload tracking with timestamps
· Structured document previews

🛠️ Technology Stack

Frontend

· Vite - Next-generation frontend tooling
· React 18+ - Modern UI library with hooks
· HTML5 - Semantic markup
· CSS3 - Modern styling and responsive design
· JavaScript ES6+ - Client-side functionality

Backend

· Node.js - Runtime environment
· Express.js - Web application framework
· MongoDB - NoSQL database for document storage
· Mongoose - MongoDB object modeling

Deployment & Hosting

· Render - Backend deployment platform
· Vercel - Frontend deployment platform

🚀 Getting Started

Prerequisites

· Node.js (v16 or higher)
· MongoDB database
· npm or yarn package manager

Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/owl-ai.git
   cd owl-ai
   ```
2. Install dependencies
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies  
   cd ../frontend
   npm install
   ```
3. Environment Setup
   Create a .env file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. Run the application
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # Start frontend development server (from frontend directory)
   npm run dev
   ```
5. Access the application
   · Frontend: http://localhost:3000
   · Backend API: http://localhost:5000

🎯 Usage

1. Registration & Login
   · Create a new account or sign in to existing account
   · Secure authentication system
2. Document Management
   · Upload PDFs and documents through the dashboard
   · Organize files into categories (Research, Articles, etc.)
   · View uploaded documents with preview information
3. AI Analysis
   · Select documents for analysis
   · Choose from multiple analysis types:
     · Summary: Get concise overview
     · Key Points: Extract main ideas
     · Sentiment: Analyze emotional tone
     · Full Analysis: Comprehensive insights
4. Advanced Search
   · Use semantic search to find content by meaning
   · Context-aware results based on document content

🌐 Deployment

Frontend (Vercel)

```bash
npm run build
vercel --prod
```

Backend (Render)

· Connect GitHub repository to Render
· Set environment variables
· Deploy automatically on push to main branch

🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

🆘 Support

For support and questions:

· Open an issue on GitHub
· Check our documentation
· Contact our support team

---

Owl AI - Making research smarter, one document at a time. 🦉
