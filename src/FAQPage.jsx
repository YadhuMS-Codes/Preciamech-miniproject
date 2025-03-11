
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FAQPage.css';
import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";

export default function FAQPage() {
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [adminMode, setAdminMode] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [answerText, setAnswerText] = useState({});

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

  // Fetch questions from Firestore
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const questionList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt ? new Date(doc.data().createdAt.toDate()).toLocaleDateString() : new Date().toLocaleDateString()
        }));
        setPendingQuestions(questionList);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setSubmitMessage("Error loading questions. Please try again later.");
        setTimeout(() => setSubmitMessage(""), 5000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Submit question to Firestore
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await addDoc(collection(db, "questions"), {
        question: question,
        email: email,
        createdAt: serverTimestamp(),
        answered: false,
        answer: ""
      });
      
      setSubmitMessage('Your question has been submitted. We will get back to you shortly.');
      setQuestion('');
      setEmail('');
      
      // Refresh questions list
      const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const questionList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt ? new Date(doc.data().createdAt.toDate()).toLocaleDateString() : new Date().toLocaleDateString()
      }));
      setPendingQuestions(questionList);
    } catch (error) {
      console.error("Error adding question:", error);
      setSubmitMessage("Error submitting your question. Please try again later.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // In a real application, this would verify credentials against a database
    // For demo purposes, we're using hardcoded credentials
    if (adminUsername === 'admin' && adminPassword === 'password') {
      setAdminMode(true);
      setSubmitMessage('Admin logged in successfully');
      setTimeout(() => setSubmitMessage(''), 3000);
    } else {
      setSubmitMessage('Invalid credentials');
      setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  const handleAnswerChange = (id, text) => {
    setAnswerText({ ...answerText, [id]: text });
  };

  const handleAnswerQuestion = async (id) => {
    if (!answerText[id] || answerText[id].trim() === '') {
      setSubmitMessage('Please provide an answer before submitting');
      setTimeout(() => setSubmitMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const questionRef = doc(db, "questions", id);
      await updateDoc(questionRef, {
        answered: true,
        answer: answerText[id],
        answeredAt: serverTimestamp()
      });

      // Update the local state
      setPendingQuestions(prevQuestions => 
        prevQuestions.map(q => 
          q.id === id ? {...q, answered: true, answer: answerText[id]} : q
        )
      );
      setSubmitMessage('Answer submitted successfully');
    } catch (error) {
      console.error("Error updating question:", error);
      setSubmitMessage("Error submitting answer. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSubmitMessage(''), 3000);
    }
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
              disabled={isLoading}
            />
            <textarea 
              placeholder="Your Question" 
              value={question} 
              onChange={(e) => setQuestion(e.target.value)} 
              required
              disabled={isLoading}
            ></textarea>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Question"}
            </button>
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
                disabled={isLoading}
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)} 
                required 
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading}>Login</button>
            </form>
          </div>
        ) : (
          <div className="admin-panel">
            <h2>Admin Panel</h2>
            {isLoading && <p>Loading...</p>}
            <div className="pending-questions">
              <h3>User Questions</h3>
              {pendingQuestions.length === 0 ? (
                <p>No questions found</p>
              ) : (
                pendingQuestions.map((q) => (
                  <div key={q.id} className={`pending-question ${q.answered ? 'answered' : ''}`}>
                    <p><strong>Question:</strong> {q.question}</p>
                    <p><strong>Email:</strong> {q.email}</p>
                    <p><strong>Date:</strong> {q.date}</p>
                    {q.answered && (
                      <div className="answer-section">
                        <p><strong>Answer:</strong> {q.answer}</p>
                        <span className="answered-tag">Answered</span>
                      </div>
                    )}
                    {!q.answered && (
                      <div className="admin-actions">
                        <textarea 
                          placeholder="Type your answer here..." 
                          value={answerText[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          disabled={isLoading}
                        ></textarea>
                        <button 
                          onClick={() => handleAnswerQuestion(q.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending..." : "Send Answer"}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setAdminMode(false)} disabled={isLoading}>Logout</button>
          </div>
        )}
      </div>

      <footer>
        <p>&copy; 2025 Preciamech Consultants. All rights reserved.</p>
      </footer>
    </div>
  );
}
