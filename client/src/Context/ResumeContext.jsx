import  { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:4000/api/resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumes(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching resumes:", err.response?.data || err.message);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <ResumeContext.Provider value={{ resumes, loading, error, fetchResumes }}>
      {children}
    </ResumeContext.Provider>
  );
};
