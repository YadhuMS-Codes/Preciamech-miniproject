import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FAQPage.css';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

const FAQPage = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const q = query(
        collection(db, "questions"),
        where("published", "==", true),
        where("answered", "==", true)
      );

      const querySnapshot = await getDocs(q);
      const faqList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        question: doc.data().question || "No question available",
        answer: doc.data().answer || "No answer available",
        email: doc.data().email,
        date: doc.data().createdAt ? new Date(doc.data().createdAt.toDate()).toLocaleDateString() : new Date().toLocaleDateString()
      }));

      setFaqs(faqList);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

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
    } catch (error) {
      console.error("Error adding question:", error);
      setSubmitMessage("Error submitting your question. Please try again later.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
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
    </div>
  );
};

export default FAQPage;