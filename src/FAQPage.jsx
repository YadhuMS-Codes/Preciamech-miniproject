import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FAQPage.css';
import { db } from "./firebaseConfig";
import './firebaseConfig.jsx';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
export default function FAQPage() {
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [adminMode, setAdminMode] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  // Complete FAQ list
  const faqs = [
    {
      id: 1,
      question: "What services do you provide?",
      answer: "We offer comprehensive engineering services including architectural design, project management, and technical consulting across various industries."
    },
    {
      id: 2,
      question: "How do you ensure project quality?",
      answer: "We maintain strict quality control measures, follow industry best practices, and employ experienced professionals to ensure the highest standards in all our projects."
    },
    {
      id: 3,
      question: "What is your project timeline?",
      answer: "Project timelines vary based on scope and complexity. We provide detailed project schedules during the initial consultation phase."
    },
    {
      id: 4,
      question: "Do you handle international projects?",
      answer: "Yes, we have experience working with clients globally and can adapt to different international standards and requirements."
    },
    {
      id: 5,
      question: "What industries do you specialize in?",
      answer: "We specialize in Pharmaceuticals (API & Formulations), Chemical, Food & Beverages, and FMCG industries, with 25+ years of experience in these sectors."
    },
    {
      id: 6,
      question: "How do you handle confidential projects?",
      answer: "We sign NDAs and follow strict confidentiality protocols. All project information is kept secure and only accessible to team members working directly on the project."
    },
    {
      id: 7,
      question: "What's your approach to sustainable design?",
      answer: "We incorporate sustainable design principles in all our projects, focusing on energy efficiency, minimal environmental impact, and long-term sustainability."
    },
    {
      id: 8,
      question: "How do you manage unexpected challenges during a project?",
      answer: "We have a robust risk management system. We identify potential risks early, develop contingency plans, and maintain transparent communication with clients throughout the process."
    }
  ];

  // List of pending questions (would be fetched from a database in a real app)
  const [pendingQuestions, setPendingQuestions] = useState([
    {
      id: 101,
      question: "Do you offer consulting services for startups?",
      email: "startup@example.com",
      date: "2025-02-15",
      answered: false
    },
    {
      id: 102,
      question: "What's your pricing structure for small businesses?",
      email: "smallbiz@example.com",
      date: "2025-02-20",
      answered: false
    }
  ]);

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    // In a real application, this would send the question to a database
    setSubmitMessage('Your question has been submitted. We will get back to you shortly.');
    setQuestion('');
    setEmail('');
    setTimeout(() => setSubmitMessage(''), 5000);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // In a real application, this would verify credentials against a database
    if (adminUsername === 'admin' && adminPassword === 'password') {
      setAdminMode(true);
      setSubmitMessage('Admin logged in successfully');
      setTimeout(() => setSubmitMessage(''), 3000);
    } else {
      setSubmitMessage('Invalid credentials');
      setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  const handleAnswerQuestion = (id) => {
    // In a real application, this would update the question status in a database
    setPendingQuestions(pendingQuestions.map(q => 
      q.id === id ? {...q, answered: true} : q
    ));
  };

  return (
    <div className="faq-page">
      <nav className="faq-nav">
        <div className="logo-container">
          <img src="/logoprecia.png" alt="PreciaMech Logo" className="logo-image" />
          <div className="logo">
            PRECIAMECH
            <span className="logo-subtitle">ENGINEERING CONSULTANTS</span>
          </div>
        </div>
        <div className="nav-links">
          <Link to="/">Back to Home</Link>
        </div>
      </nav>

      <div className="faq-container">
        <h1>Frequently Asked Questions</h1>

        <div className="faq-list">
          {faqs.map((faq) => (
            <div key={faq.id} className="faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="ask-question-section">
          <h2>Ask a Question</h2>
          <form onSubmit={handleSubmitQuestion}>
            <input 
              type="email" 
              placeholder="Your Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <textarea 
              placeholder="Your Question" 
              value={question} 
              onChange={(e) => setQuestion(e.target.value)} 
              required
            ></textarea>
            <button type="submit">Submit Question</button>
          </form>
        </div>

        {submitMessage && <div className="submit-message">{submitMessage}</div>}

        {!adminMode ? (
          <div className="admin-login-section">
            <h2>Admin Login</h2>
            <form onSubmit={handleAdminLogin}>
              <input 
                type="text" 
                placeholder="Username" 
                value={adminUsername} 
                onChange={(e) => setAdminUsername(e.target.value)} 
                required 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)} 
                required 
              />
              <button type="submit">Login</button>
            </form>
          </div>
        ) : (
          <div className="admin-panel">
            <h2>Admin Panel</h2>
            <div className="pending-questions">
              <h3>Pending Questions</h3>
              {pendingQuestions.length === 0 ? (
                <p>No pending questions</p>
              ) : (
                pendingQuestions.map((q) => (
                  <div key={q.id} className={`pending-question ${q.answered ? 'answered' : ''}`}>
                    <p><strong>Question:</strong> {q.question}</p>
                    <p><strong>Email:</strong> {q.email}</p>
                    <p><strong>Date:</strong> {q.date}</p>
                    {!q.answered && (
                      <div className="admin-actions">
                        <textarea placeholder="Type your answer here..."></textarea>
                        <button onClick={() => handleAnswerQuestion(q.id)}>Send Answer</button>
                      </div>
                    )}
                    {q.answered && <span className="answered-tag">Answered</span>}
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setAdminMode(false)}>Logout</button>
          </div>
        )}
      </div>

      <footer>
        <p>&copy; 2025 Preciamech Consultants. All rights reserved.</p>
      </footer>
    </div>
  );
}
