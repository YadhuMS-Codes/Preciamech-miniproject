
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FAQPage.css';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const FAQPage = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [answerText, setAnswerText] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState(null);

  // Fetch FAQs on component mount
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const q = query(collection(db, "faqs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const faqList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFaqs(faqList);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFAQs();
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
  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Simple password check - in a real app, use secure authentication
    if (adminPassword === 'admin123') { // This should be replaced with proper authentication
      setIsAdmin(true);
      fetchPendingQuestions();
    } else {
      alert('Incorrect password');
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

  // Submit answer to question and add to FAQs
  const handleSubmitAnswer = async (questionId) => {
    try {
      // Update the question with the answer
      await updateDoc(doc(db, "questions", questionId), {
        answer: answerText,
        answered: true
      });

      // Get the question data
      const questionSnapshot = pendingQuestions.find(q => q.id === questionId);
      
      // Add to FAQs collection
      await addDoc(collection(db, "faqs"), {
        question: questionSnapshot.question,
        answer: answerText,
        createdAt: serverTimestamp()
      });

      // Reset and refresh
      setAnswerText('');
      setCurrentQuestionId(null);
      fetchPendingQuestions();
      
      // Refresh FAQs
      const q = query(collection(db, "faqs"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const faqList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFaqs(faqList);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // Delete question
  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteDoc(doc(db, "questions", questionId));
        fetchPendingQuestions();
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAdmin(false);
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
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <div className="faq-question">
                <h3>Q: {faq.question}</h3>
              </div>
              <div className="faq-answer">
                <p>A: {faq.answer}</p>
              </div>
            </div>
          ))}
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
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Admin Password"
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      ) : (
        <div className="admin-panel">
          <h2>Admin Panel</h2>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          
          <h3>Pending Questions</h3>
          <div className="pending-questions">
            {pendingQuestions.length === 0 ? (
              <p>No pending questions.</p>
            ) : (
              pendingQuestions.map((q) => (
                <div key={q.id} className="pending-question">
                  <p><strong>Question:</strong> {q.question}</p>
                  <p><strong>From:</strong> {q.email}</p>
                  <p><strong>Date:</strong> {q.date}</p>
                  
                  {!q.answered ? (
                    <>
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
                        <button onClick={() => setCurrentQuestionId(q.id)}>
                          Answer
                        </button>
                      )}
                    </>
                  ) : (
                    <p><strong>Answered:</strong> {q.answer}</p>
                  )}
                  
                  <button 
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQPage;
