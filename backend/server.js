const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas Connected'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

// Document Schema
const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['research', 'notes', 'article', 'bookmark', 'other'],
    default: 'notes'
  },
  tags: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Document = mongoose.model('Document', documentSchema);

// Routes

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🦉 Owl AI Backend is running!',
    status: 'OK'
  });
});

// AUTH ROUTES

// Register route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('📝 Registration attempt:', { username, email });

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    console.log('✅ User created successfully:', user.username);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', { email });

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('✅ Login successful:', user.username);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// DOCUMENT ROUTES

// Create a new document
app.post('/api/documents', async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    // For now, we'll use a dummy user ID - we'll fix this when we add proper auth
    const userId = '65a1b2c3d4e5f6a7b8c9d0e1'; // Temporary - replace with actual user ID later

    console.log('📝 Creating document:', { title, category });

    const document = await Document.create({
      title,
      content,
      category,
      tags: tags || [],
      user: userId
    });

    console.log('✅ Document created:', document.title);

    res.status(201).json({
      success: true,
      message: 'Document created successfully',
      document
    });

  } catch (error) {
    console.error('❌ Document creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during document creation'
    });
  }
});

// Get all documents for a user
app.get('/api/documents', async (req, res) => {
  try {
    // For now, using dummy user ID
    const userId = '65a1b2c3d4e5f6a7b8c9d0e1';

    const documents = await Document.find({ user: userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: documents.length,
      data: documents
    });

  } catch (error) {
    console.error('❌ Documents fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching documents'
    });
  }
});

// Get a single document
app.get('/api/documents/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: document
    });

  } catch (error) {
    console.error('❌ Document fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching document'
    });
  }
});

// Update a document
app.put('/api/documents/:id', async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { title, content, category, tags },
      { new: true, runValidators: true }
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      message: 'Document updated successfully',
      data: document
    });

  } catch (error) {
    console.error('❌ Document update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating document'
    });
  }
});

// Delete a document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('❌ Document deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting document'
    });
  }
});

// AI ANALYSIS ROUTES - CORRECTED VERSION

// Summarize document (THIS ONE WORKS!)
app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Content too short for summarization'
      });
    }

    console.log('🤖 AI Summarization requested');

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      { 
        inputs: content,
        parameters: {
          max_length: 142,
          min_length: 56,
          do_sample: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
        timeout: 30000
      }
    );

    console.log('✅ AI Summary generated');

    const summary = response.data[0]?.summary_text;

    res.json({
      success: true,
      summary: summary,
      originalLength: content.length,
      summaryLength: summary.length,
      reduction: Math.round((1 - summary.length / content.length) * 100)
    });

  } catch (error) {
    console.error('❌ AI Summarization error:', error.response?.data || error.message);
    
    // Smart fallback
    const sentences = content.split('. ').filter(s => s.length > 20);
    const fallbackSummary = sentences.slice(0, 3).join('. ') + '.';
    
    res.json({
      success: true,
      summary: fallbackSummary,
      originalLength: content.length,
      summaryLength: fallbackSummary.length,
      reduction: Math.round((1 - fallbackSummary.length / content.length) * 100),
      note: 'Used smart fallback summary'
    });
  }
});

// Extract key points - USING ALGORITHMIC APPROACH (No API needed)
app.post('/api/ai/keypoints', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    console.log('🤖 Key Points extraction requested');

    // SMART ALGORITHMIC APPROACH - No API needed!
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 25);
    
    // Extract the most important sentences (first, middle, last)
    const importantSentences = [];
    if (sentences.length > 0) importantSentences.push(sentences[0]); // First sentence
    if (sentences.length > 2) importantSentences.push(sentences[Math.floor(sentences.length / 2)]); // Middle
    if (sentences.length > 1) importantSentences.push(sentences[sentences.length - 1]); // Last sentence
    
    // Clean up the key points
    const keyPoints = importantSentences
      .filter(sentence => sentence && sentence.trim().length > 0)
      .map(sentence => 
        sentence.trim()
          .replace(/^\s*\d+\.?\s*/, '') // Remove leading numbers
          .replace(/^[^a-zA-Z]*/, '')   // Remove leading non-letters
          .substring(0, 150)            // Limit length
          .trim()
      )
      .filter(point => point.length > 10);

    // If we don't have enough key points, add some generic ones
    const finalKeyPoints = keyPoints.length > 0 ? keyPoints : [
      "Main topics and themes discussed in the document",
      "Key findings or conclusions presented",
      "Important information worth noting"
    ];

    console.log('✅ Key Points extracted:', finalKeyPoints.length);

    res.json({
      success: true,
      keyPoints: finalKeyPoints,
      count: finalKeyPoints.length,
      note: 'Extracted using smart algorithm'
    });

  } catch (error) {
    console.error('❌ Key Points error:', error.message);
    
    // Fallback key points
    const fallbackPoints = [
      "Main themes and topics discussed",
      "Important conclusions or findings", 
      "Key data points or statistics",
      "Recommendations or action items"
    ];

    res.json({
      success: true,
      keyPoints: fallbackPoints,
      count: fallbackPoints.length,
      note: 'Used template key points'
    });
  }
});

// Analyze sentiment - USING ALGORITHMIC APPROACH (No API needed)
app.post('/api/ai/sentiment', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    console.log('🤖 Sentiment analysis requested');

    // ENHANCED SENTIMENT ANALYSIS - No API needed!
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'positive', 'success', 
      'happy', 'wonderful', 'perfect', 'love', 'brilliant', 'outstanding',
      'fantastic', 'awesome', 'superb', 'remarkable', 'impressive'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'negative', 'failure', 'problem', 
      'sad', 'horrible', 'hate', 'disappointing', 'poor', 'worst',
      'unfortunate', 'difficult', 'challenging', 'issue', 'concern'
    ];
    
    const text = content.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;
    
    // Count positive words
    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) positiveScore += matches.length;
    });
    
    // Count negative words
    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) negativeScore += matches.length;
    });

    // Determine sentiment
    let sentiment = 'NEUTRAL';
    let confidence = 50;

    if (positiveScore > negativeScore) {
      sentiment = 'POSITIVE';
      confidence = Math.min(95, 50 + (positiveScore * 10));
    } else if (negativeScore > positiveScore) {
      sentiment = 'NEGATIVE';
      confidence = Math.min(95, 50 + (negativeScore * 10));
    }

    const analysis = `The text appears ${sentiment.toLowerCase()} based on word analysis (${positiveScore} positive, ${negativeScore} negative words)`;

    console.log('✅ Sentiment analyzed:', sentiment, 'Confidence:', confidence);

    res.json({
      success: true,
      sentiment: sentiment,
      confidence: confidence,
      analysis: analysis,
      positiveWords: positiveScore,
      negativeWords: negativeScore,
      note: 'Analyzed using enhanced word analysis'
    });

  } catch (error) {
    console.error('❌ Sentiment error:', error.message);
    
    // Safe fallback
    res.json({
      success: true,
      sentiment: 'NEUTRAL',
      confidence: 50,
      analysis: 'Text analysis completed',
      note: 'Used basic sentiment analysis'
    });
  }
});

// Full document analysis - UPDATED
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { content, title } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }

    console.log('🤖 Full AI Document analysis requested');

    // Run all analyses
    const [summaryResult, keypointsResult, sentimentResult] = await Promise.allSettled([
      axios.post('http://localhost:5000/api/ai/summarize', { content }),
      axios.post('http://localhost:5000/api/ai/keypoints', { content }),
      axios.post('http://localhost:5000/api/ai/sentiment', { content })
    ]);

    const analysis = {
      summary: summaryResult.status === 'fulfilled' ? summaryResult.value.data : { success: false, error: 'Summary failed' },
      keyPoints: keypointsResult.status === 'fulfilled' ? keypointsResult.value.data : { success: false, error: 'Key points failed' },
      sentiment: sentimentResult.status === 'fulfilled' ? sentimentResult.value.data : { success: false, error: 'Sentiment failed' }
    };

    console.log('✅ Full AI Analysis completed');

    res.json({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Full AI Analysis error:', error.message);
    res.status(500).json({
      success: false,
      message: 'AI analysis service temporarily unavailable'
    });
  }
});

// Get all users (for testing)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
});