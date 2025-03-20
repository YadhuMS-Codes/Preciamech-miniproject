
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, authenticateAdmin } from './firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [answerText, setAnswerText] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectImage, setProjectImage] = useState('');

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

  // Admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const isAuthenticated = await authenticateAdmin(adminUsername, adminPassword);
      if (isAuthenticated) {
        setIsAdmin(true);
        fetchPendingQuestions();
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      setLoginError('Authentication failed. Please try again.');
    }
  };

  // Submit answer to question
  const handleSubmitAnswer = async (questionId) => {
    try {
      const questionRef = doc(db, "questions", questionId);
      await updateDoc(questionRef, {
        answer: answerText,
        answered: true,
        published: true,
        updatedAt: serverTimestamp()
      });
      setAnswerText('');
      setCurrentQuestionId(null);
      fetchPendingQuestions();
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // Add new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "projects"), {
        title: projectTitle,
        description: projectDescription,
        image: projectImage,
        createdAt: serverTimestamp()
      });
      setProjectTitle('');
      setProjectDescription('');
      setProjectImage('');
      alert('Project added successfully!');
    } catch (error) {
      console.error("Error adding project:", error);
      alert('Failed to add project');
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

  // Logout
  const handleLogout = () => {
    setIsAdmin(false);
    setAdminUsername('');
    setAdminPassword('');
  };

  return (
    <div className="admin-page">
      {!isAdmin ? (
        <div className="admin-login">
          <h2>Admin Login</h2>
          <form onSubmit={handleAdminLogin}>
            <input
              type="text"
              placeholder="Username"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            {loginError && <p className="error">{loginError}</p>}
          </form>
        </div>
      ) : (
        <div className="admin-dashboard">
          <div className="admin-header">
            <h2>Admin Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="admin-sections">
            <section className="questions-section">
              <h3>Pending Questions</h3>
              {pendingQuestions.map((question) => (
                <div key={question.id} className="question-card">
                  <p><strong>Question:</strong> {question.question}</p>
                  <p><strong>From:</strong> {question.email}</p>
                  <p><strong>Date:</strong> {question.date}</p>
                  {!question.answered ? (
                    <div>
                      <textarea
                        placeholder="Write your answer"
                        value={currentQuestionId === question.id ? answerText : ''}
                        onChange={(e) => setAnswerText(e.target.value)}
                        onClick={() => setCurrentQuestionId(question.id)}
                      />
                      <button onClick={() => handleSubmitAnswer(question.id)}>
                        Submit Answer
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p><strong>Answer:</strong> {question.answer}</p>
                    </div>
                  )}
                  <button onClick={() => handleDeleteQuestion(question.id)}>
                    Delete Question
                  </button>
                </div>
              ))}
            </section>

            <section className="add-project-section">
              <h3>Add New Project</h3>
              <form onSubmit={handleAddProject}>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Project Description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={projectImage}
                  onChange={(e) => setProjectImage(e.target.value)}
                  required
                />
                <button type="submit">Add Project</button>
              </form>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
