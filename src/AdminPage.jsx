import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage, authenticateAdmin } from './firebaseConfig';
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [answerText, setAnswerText] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Updated state variable
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const projectsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsList);
    } catch (error) {
      console.error("Error fetching projects:", error);
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

  useEffect(() => {
    if (isAdmin) {
      fetchPendingQuestions();
      fetchProjects();
    }
  }, [isAdmin]);

  // Admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const isAuthenticated = await authenticateAdmin(adminUsername, adminPassword);
      if (isAuthenticated) {
        setIsAdmin(true);
        fetchPendingQuestions();
        fetchProjects();
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      console.error("Login error:", error);
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

  // Toggle publish status
  const togglePublishStatus = async (questionId, currentStatus) => {
    try {
      const questionRef = doc(db, "questions", questionId);
      await updateDoc(questionRef, {
        published: !currentStatus,
        updatedAt: serverTimestamp()
      });
      fetchPendingQuestions();
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  // Edit FAQ
  const handleEditQuestion = async (questionId) => {
    try {
      const questionRef = doc(db, "questions", questionId);
      await updateDoc(questionRef, {
        answer: editingQuestion.answer,
        updatedAt: serverTimestamp()
      });
      setEditingQuestion(null);
      fetchPendingQuestions();
    } catch (error) {
      console.error("Error editing question:", error);
    }
  };

  // Add new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      if (!imageUrl) {
        alert('Please enter an image URL');
        return;
      }

      await addDoc(collection(db, "projects"), {
        title: projectTitle,
        description: projectDescription,
        image: imageUrl,
        visible: true,
        createdAt: serverTimestamp()
      });

      setProjectTitle('');
      setProjectDescription('');
      setImageUrl('');
      fetchProjects();
      alert('Project added successfully!');
    } catch (error) {
      console.error("Error adding project:", error);
      alert('Failed to add project');
    }
  };

  // Edit project
  const handleEditProject = async (projectId) => {
    try {
      const projectRef = doc(db, "projects", projectId);
      let updateData = {
        title: editingProject.title,
        description: editingProject.description,
        updatedAt: serverTimestamp()
      };

      if (imageUrl) { // Use imageUrl instead of projectImage
        updateData.image = imageUrl;
      }

      await updateDoc(projectRef, updateData);
      setEditingProject(null);
      setImageUrl(''); // Clear imageUrl after update
      fetchProjects();
    } catch (error) {
      console.error("Error editing project:", error);
    }
  };

  // Toggle project visibility
  const toggleProjectVisibility = async (projectId, currentVisibility) => {
    try {
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        visible: !currentVisibility,
        updatedAt: serverTimestamp()
      });
      fetchProjects();
    } catch (error) {
      console.error("Error toggling project visibility:", error);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, "projects", projectId));
        // Image deletion is not needed since we're using URLs now.
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
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

  return (
    <div className="admin-page">
      <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>

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
            <button onClick={() => setIsAdmin(false)}>Logout</button>
          </div>

          <div className="admin-sections">
            <section className="questions-section">
              <h3>FAQ Management</h3>
              {pendingQuestions.map((question) => (
                <div key={question.id} className="question-card">
                  <p><strong>Question:</strong> {question.question}</p>
                  <p><strong>From:</strong> {question.email}</p>
                  <p><strong>Date:</strong> {question.date}</p>

                  {editingQuestion?.id === question.id ? (
                    <div>
                      <textarea
                        value={editingQuestion.answer}
                        onChange={(e) => setEditingQuestion({
                          ...editingQuestion,
                          answer: e.target.value
                        })}
                      />
                      <button onClick={() => handleEditQuestion(question.id)}>
                        Save Changes
                      </button>
                      <button onClick={() => setEditingQuestion(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
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
                          <button onClick={() => setEditingQuestion(question)}>
                            Edit Answer
                          </button>
                        </div>
                      )}

                      <button onClick={() => togglePublishStatus(question.id, question.published)}>
                        {question.published ? 'Unpublish' : 'Publish'}
                      </button>

                      <button onClick={() => handleDeleteQuestion(question.id)}>
                        Delete Question
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </section>

            <section className="projects-section">
              <h3>Project Management</h3>
              <form onSubmit={handleAddProject}>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Project Description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
                {imageUrl && (
                  <div className="image-preview">
                    <img src={imageUrl} alt="Preview" />
                  </div>
                )}
                <button type="submit">Add Project</button>
              </form>

              <div className="projects-list">
                {projects.map((project) => (
                  <div key={project.id} className="project-card">
                    {editingProject?.id === project.id ? (
                      <div>
                        <input
                          type="text"
                          value={editingProject.title}
                          onChange={(e) => setEditingProject({
                            ...editingProject,
                            title: e.target.value
                          })}
                        />
                        <textarea
                          value={editingProject.description}
                          onChange={(e) => setEditingProject({
                            ...editingProject,
                            description: e.target.value
                          })}
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        /> {/* Changed to text input for URL */}
                        <button onClick={() => handleEditProject(project.id)}>
                          Save Changes
                        </button>
                        <button onClick={() => setEditingProject(null)}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <img src={project.image} alt={project.title} />
                        <h4>{project.title}</h4>
                        <p>{project.description}</p>
                        <button onClick={() => setEditingProject(project)}>
                          Edit
                        </button>
                        <button onClick={() => toggleProjectVisibility(project.id, project.visible)}>
                          {project.visible ? 'Hide' : 'Show'}
                        </button>
                        <button onClick={() => handleDeleteProject(project.id, project.image)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;