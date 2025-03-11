
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FAQPage.css';
import { db, authenticateAdmin } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  where 
} from 'firebase/firestore';

const FAQPage = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [answerText, setAnswerText] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [loginError, setLoginError] = useState('');

  // Fetch FAQs on component mount and when admin state changes
  useEffect(() => {
    console.log("Fetching initial FAQs");
    fetchFAQs();
  }, [isAdmin]); // Refresh when admin logs in/out

  // Fetch all published FAQs
  const fetchFAQs = async () => {
    try {
      console.log("Fetching FAQs");
      // Get questions that have been answered and marked as published
      const q = query(
        collection(db, "questions"),
        where("published", "==", true), 
        where("answered", "==", true),
        where("published", "==", true),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      console.log("FAQ docs found:", querySnapshot.docs.length);
      
      const faqList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log("FAQ document data:", data);
        return {
          id: doc.id,
          ...data,
          date: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : new Date().toLocaleDateString()
        };
      });
      
      console.log("Processed FAQs:", faqList);
      setFaqs(faqList);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

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
        published: false,
        answer: ""
      });
      
      setSubmitMessage('Your question has been submitted. We will get back to you shortly.');
      setQuestion('');
      setEmail('');
      
      // Refresh questions list if in admin mode
      if (isAdmin) {
        fetchPendingQuestions();
      }
    } catch (error) {
      console.error("Error adding question:", error);
      setSubmitMessage("Error submitting your question. Please try again later.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  // Admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", adminUsername);
      const isAuthenticated = await authenticateAdmin(adminUsername, adminPassword);
      
      if (isAuthenticated) {
        console.log("Authentication successful!");
        setIsAdmin(true);
        fetchPendingQuestions();
      } else {
        console.log("Authentication failed - invalid credentials");
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch pending questions for admin
  const fetchPendingQuestions = async () => {
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
    }
  };

  // Submit answer to question
  const handleSubmitAnswer = async (questionId) => {
    try {
      console.log("Submitting answer for question:", questionId);
      // Update the question with the answer
      const questionRef = doc(db, "questions", questionId);
      
      // Update with explicit fields to ensure proper data structure
      await updateDoc(questionRef, {
        answer: answerText,
        answered: true,
        published: true,  // Explicitly publish the answered question
        updatedAt: serverTimestamp()
      });

      console.log("Answer submitted and question published");

      // Reset and refresh
      setAnswerText('');
      setCurrentQuestionId(null);
      
      // Wait a moment for Firestore to update
      setTimeout(() => {
        fetchPendingQuestions();
        fetchFAQs(); // Refresh FAQs to show the newly answered question
        console.log("Refreshed FAQs after answering");
      }, 1000); // Increased timeout to ensure Firestore updates propagate
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // Toggle publish status
  const togglePublishStatus = async (questionId, currentStatus) => {
    try {
      await updateDoc(doc(db, "questions", questionId), {
        published: !currentStatus
      });
      
      fetchPendingQuestions();
      fetchFAQs();
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  // Delete question
  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteDoc(doc(db, "questions", questionId));
        fetchPendingQuestions();
        fetchFAQs();
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAdmin(false);
    setAdminUsername('');
    setAdminPassword('');
  };

  return (
    <div className="faq-page-container">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>

      <div className="faq-content">
        <div className="faq-list">
          {faqs.length > 0 ? (
            faqs.map((faq, index) => (
              <div className="faq-item" key={index}>
                <div className="faq-question">
                  <h3>Q: {faq.question}</h3>
                  <small>Asked on: {faq.date}</small>
                </div>
                <div className="faq-answer">
                  <p>A: {faq.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No FAQs available yet. Be the first to ask a question!</p>
          )}
        </div>

        <div className="ask-question">
          <h2>Have a Question?</h2>
          <form onSubmit={handleSubmitQuestion}>
            <div className="form-group">
              <label htmlFor="email">Your Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="question">Your Question:</label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                placeholder="Enter your question"
                rows="4"
              ></textarea>
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Question'}
            </button>
            {submitMessage && <p className="submit-message">{submitMessage}</p>}
          </form>
        </div>
      </div>

      {!isAdmin ? (
        <div className="admin-login">
          <h3>Admin Access</h3>
          <form onSubmit={handleAdminLogin}>
            <div className="form-group">
              <label htmlFor="admin-username">Username:</label>
              <input
                type="text"
                id="admin-username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Admin Username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="admin-password">Password:</label>
              <input
                type="password"
                id="admin-password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin Password"
                required
              />
            </div>
            <button type="submit">Login</button>
            {loginError && <p className="error-message">{loginError}</p>}
          </form>
        </div>
      ) : (
        <div className="admin-panel">
          <h2>Admin Panel</h2>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          
          <div className="admin-tabs">
            <h3>Questions Management</h3>
            <div className="pending-questions">
              {pendingQuestions.length === 0 ? (
                <p>No questions found.</p>
              ) : (
                pendingQuestions.map((q) => (
                  <div key={q.id} className="question-card">
                    <div className="question-header">
                      <h4>Question: {q.question}</h4>
                      <div className="question-meta">
                        <p><strong>From:</strong> {q.email}</p>
                        <p><strong>Date:</strong> {q.date}</p>
                        <p><strong>Status:</strong> {q.answered ? 'Answered' : 'Pending'}</p>
                        {q.answered && <p><strong>Published:</strong> {q.published ? 'Yes' : 'No'}</p>}
                      </div>
                    </div>
                    
                    {q.answered ? (
                      <div className="answer-section">
                        <p><strong>Answer:</strong> {q.answer}</p>
                        <div className="admin-actions">
                          <button 
                            onClick={() => togglePublishStatus(q.id, q.published)}
                            className={q.published ? "unpublish-btn" : "publish-btn"}
                          >
                            {q.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="answer-section">
                        {currentQuestionId === q.id ? (
                          <div className="answer-form">
                            <textarea
                              value={answerText}
                              onChange={(e) => setAnswerText(e.target.value)}
                              placeholder="Write your answer here"
                              rows="4"
                            ></textarea>
                            <div className="answer-buttons">
                              <button onClick={() => handleSubmitAnswer(q.id)}>
                                Submit Answer
                              </button>
                              <button onClick={() => setCurrentQuestionId(null)}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="admin-actions">
                            <button onClick={() => setCurrentQuestionId(q.id)}>
                              Answer
                            </button>
                            <button 
                              onClick={() => handleDeleteQuestion(q.id)}
                              className="delete-btn"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQPage;
