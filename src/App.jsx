import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useTranslation } from 'react-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './i18n';
import './App.css';
//import ImageSlider from './ImageSlider'; // Removed import -  This import was likely causing the error.  The Gallery section needs to be handled differently.

export default function App() {
   const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [flippedCard, setFlippedCard] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState('home'); // Added for SPA navigation
  const [showMoreFAQs, setShowMoreFAQs] = useState(false); // For View More FAQs functionality
  const projectsRef = useRef(null);
  const servicesRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsQuery = query(
          collection(db, "projects"), 
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(projectsQuery);
        const projectsList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(project => project.visible !== false); // Only show visible projects
        setProjects(projectsList);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const services = [
    {
      id: 1,
      title: "Architectural Design",
      image:
        "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?fit=crop&w=600&h=400",
      cardImage:
        "https://images.unsplash.com/photo-1505238680356-667803448bb6?fit=crop&w=600&h=300",
      details: {
        title: "Architectural Design",
        description: "Innovative solutions for complex engineering challenges",
        items: [
          "Design Basis",
          "Plot Plan Development",
          "Statutory Drawings",
          "Floor Plans, Sections, Elevations, Structural Glazing, Finishing Detailing",
          "3D Designs",
        ],
        expertise: "15+ years of engineering expertise",
      },
    },
    {
      id: 2,
      title: "Civil & Structural Design",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?fit=crop&w=600&h=400",
      cardImage:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?fit=crop&w=600&h=300",
      details: {
        title: "Civil & Structural Design",
        description: "Streamlined project delivery and resource optimization",
        items: [
          "Design Basis",
          "Site Development Drawings",
          "RCC Design & Drawings",
          "Structural Design & Drawings",
          "Preparation of Tender Documents",
          "Bid Evaluation, Recommendation and Assisting Client on Procurement",
          "Vendor Drawing Approval, Inspection and Expediting",
          "Cost Estimation",
          "Construction Management",
        ],
        expertise: "500+ successful projects delivered",
      },
    },
    {
      id: 3,
      title: "Process Engineering",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?fit=crop&w=600&h=400",
      cardImage:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?fit=crop&w=600&h=300",
      details: {
        title: "Process Engineering",
        description: "Expert guidance for technical challenges",
        items: [
          "Design Basis",
          "Energy Balance",
          "Process Flow Diagram (PFD)",
          "Piping & Instrumentation Diagram (P&ID)",
          "Process Datasheet",
          "Equipment List",
          "Assisting in Commissioning Process System and Trouble Shooting",
        ],
        expertise: "Industry-leading consultation services",
      },
    },
    {
      id: 4,
      title: "Mechanical Engineering",
      image:
        "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?fit=crop&w=600&h=400",
      cardImage:
        "https://images.unsplash.com/photo-1581093458791-9d19a807b82c?fit=crop&w=600&h=300",
      details: {
        title: "Mechanical Engineering",
        description: "Comprehensive mechanical solutions for industrial applications",
        items: [
          "Design Basis",
            "Design & Drawing of Equipment Layout, Foundation Layout, Piping Layout, Piping Isometric, Statutory Drawings for PESO / IBR approval etc.",
            "Preparation of Specification of Proprietary & Fabricated Equipment for Process & Utilities, Piping, Valves, Tenders etc.",
            "Bid Evaluation, Recommendation and Assisting Client on Procurement",
            "Vendor Drawing Approval, Inspection and Expediting",
            "Cost Estimation",
            "Construction Management",
        ],
        expertise: "25+ years of mechanical engineering expertise",
      },
    },
    {
      id: 5,
      title: "Instrumentation Engineering",
      image:
        "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?fit=crop&w=600&h=400",
      cardImage:
        "https://images.unsplash.com/photo-1581093458791-9d19a807b82c?fit=crop&w=600&h=300",
      details: {
        title: "Instrumentation Engineering",
        description: "Comprehensive mechanical solutions for industrial applications",
        items: [
          "Design Basis",
            "Preparation of Instrument List, IO List, Air Header Schedule, JB Schedule etc.",
            "Design & Drawing of Control System Architect, Control Room Layout, JB Layout, Air Header Layout, Cable Tray Layout, Loop Diagram, Hook Up Diagram etc.",
            "Preparation of Specification of Instruments, Control Systems (PLC, DCS, Relay based etc.), Tenders etc.",
            "Bid Evaluation, Recommendation and Assisting Client on Procurement",
            "Vendor Drawing Approval, Inspection and Expediting",
            "Cost Estimation",
            "Construction Management"
        ],
        expertise: "25+ years of mechanical engineering expertise",
      },
    },
    {
      id: 6,
      title: "Water System Engineering",
      image:
        "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?fit=crop&w=600&h=400",
      cardImage:
        "https://images.unsplash.com/photo-1581093458791-9d19a807b82c?fit=crop&w=600&h=300",
      details: {
        title: "Water System Engineering",
        description: "Comprehensive mechanical solutions for industrial applications",
        items: [
          "Design Basis in compliance with IS, WHO, USFDA, EP, JP standard",
            "Preparation of Water Balance, Pressure Drop Calculations, PFD, P&ID etc.",
            "Design & Drawing of Equipment Layout, Foundation Layout, Piping Layout etc.",
            "Specification of Water Treatment System, WFI Generation, Pure Steam Generation, Clean Utility (PW, WFI, PS) Distribution etc.",
            "Bid Evaluation, Recommendation and Assisting Client on Procurement",
            "Vendor Drawing Approval, Inspection and Expediting",
            "Cost Estimation",
            "Construction Management"
        ],
        expertise: "25+ years of mechanical engineering expertise",
      },
    },
    {
      id: 7,
      title: "Sewage & Effluent Treatment System Engineering",
      image:
        "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?fit=crop&w=600&h=400",
      cardImage:
        "https://images.unsplash.com/photo-1581093458791-9d19a807b82c?fit=crop&w=600&h=300",
      details: {
        title: "Sewage & Effluent Treatment System Engineering",
        description: "Comprehensive mechanical solutions for industrial applications",
        items: [
          "Design Basis in compliance with CPCB, Local Pollution Control Authority etc.",
            "Preparation of PFD, Hydraulic Flow Diagram etc.",
            "Design & Drawing of Equipment Layout, Piping Layout etc.",
            "Specification of STP, ETP and ZLD systems, including RO, MEE, ATFD etc.",
            "Bid Evaluation, Recommendation and Assisting Client on Procurement",
            "Vendor Drawing Approval, Inspection and Expediting",
            "Cost Estimation",
            "Construction Management"
        ],
        expertise: "25+ years of mechanical engineering expertise",
      },
    },
    {
      id: 8,
      title: "Electrical Engineering",
      image:
        "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?fit=crop&w=600&h=400",
      cardImage:
        "https://images.unsplash.com/photo-1581093458791-9d19a807b82c?fit=crop&w=600&h=300",
      details: {
        title: "Electrical Engineering",
        description: "Comprehensive mechanical solutions for industrial applications",
        items: [
          "Design Basis",
            "SLD, Panel Room Layout, Substation Layout, Cable Tray Layout, Lighting Layout, LV System Layout, Earthing Layout",
            "Preparation of Equipment & Component Specification and Tender Documents",
            "Bid Evaluation, Recommendation and Assisting Client on Procurement",
            "Vendor Drawing Approval, Inspection and Expediting",
            "Cost Estimation",
            "Construction Management"
        ],
        expertise: "25+ years of mechanical engineering expertise",
      },
    },
    {
      id: 9,
      title: "HVAC Engineering",
      image:
        "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?fit=crop&w=600&h=400",
      cardImage:
        "https://images.unsplash.com/photo-1581093458791-9d19a807b82c?fit=crop&w=600&h=300",
      details: {
        title: "HVAC Engineering",
        description: "Comprehensive mechanical solutions for industrial applications",
        items: [
            "Design Basis",
            "Preparation of Load Calculation",
            "Design & Drawing of Zoning Layout, Air Flow Diagram, Equipment Layout, Ducting Layout, Air Diffuser Layout, Piping Layout, Cable Tray Layout, Electrical SLD & Control Circuit Diagram, BMS System etc.",
            "Preparation of Specification of High and Low Side Equipment, BMS System, Tenders etc.",
            "Bid Evaluation, Recommendation and Assisting Client on Procurement",
            "Vendor Drawing Approval, Inspection and Expediting",
            "Cost Estimation",
            "Construction Management"
        ],
        expertise: "25+ years of mechanical engineering expertise",
      },
    },
    {
      id: 10,
      title: "Fire Protection System",
      image:
        "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?fit=crop&w=600&h=400",
      cardImage:
        "https://images.unsplash.com/photo-1581093458791-9d19a807b82c?fit=crop&w=600&h=300",
      details: {
        title: "Fire Protection System",
        description: "Comprehensive mechanical solutions for industrial applications",
        items: [
            "Design Basis",
            "Detailed Engineering in compliance with NBC, Local Control Rules & Regulations, NFPA, FM Global etc.",
            "Design & Drawing of Fire Hydrant, Fire Sprinkler, Fire Extinguisher, Foam System, Fire Alarm, Gas Suppression System etc.",
            "Preparation of Specification of Equipment, Tenders etc.",
            "Bid Evaluation, Recommendation and Assisting Client on Procurement",
            "Vendor Drawing Approval, Inspection and Expediting",
            "Cost Estimation",
            "Construction Management"
        ],
        expertise: "25+ years of mechanical engineering expertise",
      },
    },
  ];

  // Additional FAQs for the expandable FAQ section
  const faqs = [
    {
      question: "What services do you provide?",
      answer: "We offer comprehensive engineering services including architectural design, project management, and technical consulting across various industries."
    },
    {
      question: "How do you ensure project quality?",
      answer: "We maintain strict quality control measures, follow industry best practices, and employ experienced professionals to ensure the highest standards in all our projects."
    },
    {
      question: "What is your project timeline?",
      answer: "Project timelines vary based on scope and complexity. We provide detailed project schedules during the initial consultation phase."
    },
    {
      question: "Do you handle international projects?",
      answer: "Yes, we have experience working with clients globally and can adapt to different international standards and requirements."
    },
    // Additional FAQs that will be shown when "View More" is clicked
    {
      question: "What industries do you specialize in?",
      answer: "We specialize in Pharmaceuticals (API & Formulations), Chemical, Food & Beverages, and FMCG industries with over 25 years of experience."
    },
    {
      question: "How do you handle project revisions?",
      answer: "We have a structured revision process with defined milestones for client feedback. Our flexible approach ensures your requirements are fully met while maintaining project timelines."
    },
    {
      question: "What is your approach to sustainable engineering?",
      answer: "Sustainability is integral to our designs. We incorporate energy-efficient systems, sustainable materials, and environmentally responsible practices in all our projects."
    },
    {
      question: "How do you manage project costs?",
      answer: "We employ rigorous cost estimation and control measures throughout the project lifecycle. Regular budget reviews and value engineering ensure optimal use of resources."
    },
    {
      question: "What software and tools do you use?",
      answer: "We utilize industry-leading software including AutoCAD, Revit, SolidWorks, ANSYS, and specialized tools for specific engineering disciplines to ensure precision and efficiency."
    }
  ];

  // Service navigation with keyboard
  const handleKeyPress = useCallback((e) => {
    if (!selectedService) return;

    if (e.key === "ArrowLeft") {
      setCurrentIndex((prev) => {
        const newIndex = prev > 0 ? prev - 1 : services.length - 1;
        setSelectedService(services[newIndex]);
        return newIndex;
      });
    } else if (e.key === "ArrowRight") {
      setCurrentIndex((prev) => {
        const newIndex = prev < services.length - 1 ? prev + 1 : 0;
        setSelectedService(services[newIndex]);
        return newIndex;
      });
    }
  }, [selectedService, services]);

  // Project navigation with keyboard
  const handleProjectKeyPress = useCallback((e) => {
    if (e.key === "ArrowLeft") {
      navigateProjects('prev');
    } else if (e.key === "ArrowRight") {
      navigateProjects('next');
    }
  }, []);

  const handleCardKeyPress = useCallback((e) => {
    if (flippedCard !== null) {
      if (e.key === "ArrowLeft") {
        setFlippedCard(Math.max(0, flippedCard - 1));
      } else if (e.key === "ArrowRight") {
        setFlippedCard(Math.min(2, flippedCard + 1));
      }
    }
  }, [flippedCard]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keydown", handleProjectKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keydown", handleProjectKeyPress);
    };
  }, [handleKeyPress, handleProjectKeyPress]);

  // Functions to scroll projects
  const navigateProjects = (direction) => {
    setCurrentProjectIndex(prevIndex => {
      let newIndex;
      if (direction === 'next') {
        newIndex = prevIndex < projects.length - 1 ? prevIndex + 1 : 0;
      } else {
        newIndex = prevIndex > 0 ? prevIndex - 1 : projects.length - 1;
      }

      if (projectsRef.current) {
        const scrollAmount = projectsRef.current.querySelector('.project-card').offsetWidth + 20; // 20px for margin
        projectsRef.current.scrollTo({
          left: newIndex * scrollAmount,
          behavior: 'smooth'
        });
      }

      return newIndex;
    });
  };

  // Functions to scroll services
  const navigateServices = (direction) => {
    const scrollAmount = 300; // Width of a service card plus margins
    if (servicesRef.current) {
      if (direction === 'next') {
        servicesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        servicesRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    window.addEventListener("keydown", handleCardKeyPress);
    return () => window.removeEventListener("keydown", handleCardKeyPress);
  }, [handleCardKeyPress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await emailjs.send(
        "service_yrwqlun", // Replace with your EmailJS service ID
        "template_v0t030p", // Replace with your EmailJS template ID
        formData,
        "a3-PM_cyuqyXkuJQr", // Replace with your EmailJS public key
      );

      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitSuccess(null), 5000);
    } catch (error) {
      setSubmitSuccess(false);
      console.error("Failed to send message:", error);
      setTimeout(() => setSubmitSuccess(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the appropriate content based on the current page
  const renderContent = () => {
    if (currentPage === 'faq') {
      return (
        <div className="full-faq-page">
          <div className="faq-header">
            <h1>Frequently Asked Questions</h1>
            <button className="back-button" onClick={() => setCurrentPage('home')}>
              Back to Home
            </button>
          </div>
          <div className="full-faq-content">
            {faqs.map((faq, index) => (
              <div className="faq-item" key={index}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <>
        <section id="home" className="hero">
          <div className="hero1">
            <span data-hover="PRocess">P</span>
            <span data-hover="PRocess">R</span>
            <span data-hover="Electrical">E</span>
            <span data-hover="Civil">C</span>
            <span data-hover="Instrumentation">I</span>
            <span data-hover="Architecture design">A</span>
            <span data-hover="MEChanical">M</span>
            <span data-hover="MEChanical">E</span>
            <span data-hover="MEChanical">C</span>
            <span data-hover="HVAC">H</span>
          </div>
          <h1>ENGINEERING CONSULTANTS</h1>
          <p>Great Value Engineering Service Provider</p>
        </section>

        {/* Services section with horizontal scrolling */}
        <section id="services" className="services">
          <h2 data-aos="fade-up">Our Services</h2>
          <div className="service-scroll-controls">
            <button 
              className="service-scroll-btn prev-btn" 
              onClick={() => navigateServices('prev')}
              aria-label="Previous services"
            >
              ←
            </button>
            <div className="service-grid-container">
              <div className="service-grid" ref={servicesRef}>
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className="service-card"
                    onClick={() => setSelectedService(service)}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <img
                      src={service.cardImage}
                      alt={service.title}
                      className="service-card-image"
                      loading="lazy"
                    />
                    <h3>{service.title}</h3>
                    <button className="view-more">View Details →</button>
                  </div>
                ))}
              </div>
            </div>
            <button 
              className="service-scroll-btn next-btn" 
              onClick={() => navigateServices('next')}
              aria-label="Next services"
            >
              →
            </button>
          </div>

          {selectedService && (
            <div
              className="modal-overlay"
              onClick={() => setSelectedService(null)}
            >
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                  className="modal-close"
                  onClick={() => setSelectedService(null)}
                  aria-label="Close modal"
                >
                  ×
                </button>
                <img src={selectedService.image} alt={selectedService.title} loading="lazy" />
                <h3>{selectedService.details.title}</h3>
                <ul>
                  {selectedService.details.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Projects section with horizontal scrolling */}
        <section id="projects" className="projects">
          <h2 data-aos="fade-up">Recent Projects</h2>
          <div className="project-carousel">
            <button 
              className="project-nav prev" 
              onClick={() => navigateProjects('prev')}
              aria-label="Previous project"
            >
              ←
            </button>

            <div className="project-viewport">
              <div className="project-slider" ref={projectsRef}>
                {projects.map((project, index) => (
                  <div 
                    key={project.id} 
                    className={`project-card ${index === currentProjectIndex ? 'active' : ''}`}
                    data-aos="fade-up" 
                    data-aos-delay={(index % 3) * 100}
                    onClick={() => setSelectedService(project)}
                  >
                    <div className="project-image">
                      <img
                        src={project.image || '/logoprecia.png'}
                        alt={project.title}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/logoprecia.png';
                        }}
                      />
                      <h3>{project.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedService && (
              <div className="project-modal" onClick={() => setSelectedService(null)}>
                <div className="project-modal-content" onClick={e => e.stopPropagation()}>
                  <button 
                    className="project-modal-close"
                    onClick={() => setSelectedService(null)}
                  >
                    ×
                  </button>
                  <img
                    src={selectedService.image || '/logoprecia.png'}
                    alt={selectedService.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/logoprecia.png';
                    }}
                  />
                  <h3>{selectedService.title}</h3>
                  <p>{selectedService.description}</p>
                </div>
              </div>
            )}

            <button 
              className="project-nav next" 
              onClick={() => navigateProjects('next')}
              aria-label="Next project"
            >
              →
            </button>
          </div>

          <div className="project-indicators">
            {projects.map((_, index) => (
              <button 
                key={index}
                className={`indicator ${index === currentProjectIndex ? 'active' : ''}`}
                onClick={() => {
                  setCurrentProjectIndex(index);
                  if (projectsRef.current) {
                    const scrollAmount = projectsRef.current.querySelector('.project-card').offsetWidth + 20;
                    projectsRef.current.scrollTo({
                      left: index * scrollAmount,
                      behavior: 'smooth'
                    });
                  }
                }}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section id="pic" className="pic">
          <h3 data-aos="fade-up">Some of the key client's project handled by our team in Engineering, FMCG, Food &Agricultural Segment</h3>
          <div className="image-grid">
            {[...Array(33)].map((_, index) => (
              <img 
                key={index} 
                src={`companies/${index + 1}.png`} 
                alt={`Client ${index + 1}`} 
                loading="lazy"
              />
            ))}
          </div>
        </section>

        <section id="about" className="about">
          <h2 data-aos="fade-up">About Us</h2>
          <div className="about-content" data-aos="fade-up" data-aos-delay="100">
            <div className="about-text">
              <p>
                Preciamech Engineering Consultants provides Engineering
                Consultancy Services for industrial segments.
              </p>
              <p>
                Preciamech Engineering Consultants is a team of qualified and
                talented professionals with 25+years experience in Consultancy
                field, having vast experience in industrial segment specially in
                Pharmaceuticals (API & Formulations), Chemical, Food & Beverages
                and FMCG.
              </p>
              <p>
                Preciamech Engineering Consultants is committed to provides
                Quality and Precise Engineering Services to suit the cost
                effective project implementation...
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <h3>25+</h3>
                <p>Years Experience</p>
              </div>
              <div className="stat-item">
                <h3>50+</h3>
                <p>Expert Engineers</p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="faq">
          <h2 data-aos="fade-up">Frequently Asked Questions</h2>
          <div className="faq-grid" data-aos="fade-up" data-aos-delay="100">
            {faqs.slice(0, 4).map((faq, index) => (
              <div className="faq-item" key={index}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>

          <button 
            className="view-more-faq" 
            onClick={() => navigate("/faq")} // Navigates to FAQPage.jsx
          >
            View More FAQs
          </button>
        </section>

        {/* Gallery section - Placeholder for now */}
        <section id="Gallery">
          <div>
            <h2 className="text-center text-2xl font-bold mb-4">Company Gallery</h2>
            <p className="text-center">Gallery images coming soon</p>
          </div>
        </section>

        <section id="contact" className="contact">
          <h2 data-aos="fade-up">Request Proposal</h2>
          <div
            className="contact-container"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              {submitSuccess === true && (
                <div className="success-message">Message sent successfully!</div>
              )}

              {submitSuccess === false && (
                <div className="error-message">Failed to send message. Please try again.</div>
              )}
            </form>
          </div>

          <div className="map">
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.090075306076!2d73.04066929999999!3d19.015752099999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c336ef0c7ff7%3A0x516486872120ced1!2sPreciamech%20Engineering%20Consultants!5e0!3m2!1sen!2sin!4v1740040731452!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="app">
      {currentPage === 'home' && (
        <nav>
          <div className="logo-container">
            <img
              src="/logoprecia.png"
              alt="PreciaMech Logo"
              className="logo-image"
              onClick={() => window.location.reload()}
            />
            <div className="logo">
              PRECIAMECH
              <span className="logo-subtitle">ENGINEERING CONSULTANTS</span>
            </div>
          </div>
          <div className="nav-links">
            <a href="/admin" onClick={() => navigate('/admin')}>
              Admin Login</a>
            <a href="#home">{t("nav.home")}</a>
            <a href="#services">{t("nav.services")}</a>
            <a href="#projects">{t("nav.projects")}</a>
            <a href="#contact">{t("nav.contact")}</a>
            <select
              className="language-select"
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </nav>
      )}

      {renderContent()}

      {currentPage === 'home' && (
        <footer className="main-footer">
          <div className="footer-content">
            <div className="footer-info">
              <div className="footer-logo">
                <img src="/logoprecia.png" alt="PreciaMech Logo" className="footer-logo-image" />
                <div>PRECIAMECH</div>
              </div>
              <p>Great Value Engineering Service Provider</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Quick Links</h4>
                <a href="#home">Home</a>
                <a href="#services">Services</a>
                <a href="#projects">Projects</a>
                <a href="#about">About Us</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-column">
                <h4>Contact Us</h4>
                <p>Email: info@preciamech.com</p>
                <p>Phone: +91 9867XXXXXX</p>
                <p>Location: Mumbai, India</p>
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025 Preciamech Consultants. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}