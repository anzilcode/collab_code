import  { useState,useEffect } from "react";
import { User, Mail, MapPin, Briefcase, GraduationCap, Award, Save, FileText, Upload, X, Camera } from "lucide-react";
import axios from 'axios'

function AddResumeForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    jobRole: "",
    profileSummary: "",
    education: "",
    experience: "",
    skills: "",
    certifications: ""
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isExistingResume, setIsExistingResume] = useState(false);


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async () => {
  try {
    const form = new FormData();

    for (const key in formData) {
      form.append(key, formData[key]);
    }

    if (profilePhoto) {
      form.append("profilePhoto", profilePhoto);
    }

    const token = localStorage.getItem("token"); 

    const response = await axios.post(
      "http://localhost:4000/api/resumes",
      form,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Profile saved successfully!");
    console.log(response.data);

  } catch (error) {
    console.error("Error submitting form:", error.response?.data || error.message);
    alert("Something went wrong: " + (error.response?.data?.message || error.message));
  }
};

  const completionPercentage = Math.round(((Object.values(formData).filter(value => value.trim() !== "").length + (profilePhoto ? 1 : 0)) / 11) * 100);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token"); 
        console.log(token); 
        const { data } = await axios.get("http://localhost:4000/api/resumes/my",
        {
          headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        )
        if (data) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            jobRole: data.jobRole || "",
            profileSummary: data.profileSummary || "",
            education: data.education || "",
            experience: data.experience || "",
            skills: data.skills || "",
            certifications: data.certifications || ""
          });
          if (data.profilePhoto) setPhotoPreview(data.profilePhoto);
          setIsExistingResume(true); 
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    fetchResume();
  }, []);


  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-800 p-3 rounded-lg">
              <FileText className="text-gray-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">
              {isExistingResume ? "Update Your Profile" : "Create Your Profile"}
              </h1>
              <p className="text-gray-400 mt-1">Build a comprehensive professional profile</p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-gray-900 rounded-lg border border-gray-700">
          <div className="p-6 space-y-8">
            
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="border-b border-gray-700 pb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <User className="mr-2 text-blue-400" size={20} />
                  Personal Information
                </h2>
              </div>
              
              {/* Profile Photo */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Profile Photo</label>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {photoPreview ? (
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Profile preview"
                          className="w-24 h-24 rounded-lg object-cover border border-gray-600"
                        />
                        <button
                          onClick={removePhoto}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-gray-800">
                        <Camera className="text-gray-400" size={20} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <span className="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors">
                          <Upload size={16} className="mr-2" />
                          {photoPreview ? 'Change Photo' : 'Upload Photo'}
                        </span>
                      </label>
                      {photoPreview && (
                        <button
                          onClick={removePhoto}
                          className="text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Upload a professional headshot. JPG, PNG or GIF (max 5MB)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="john.doe@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Job Role <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={formData.jobRole}
                    onChange={(e) => handleInputChange("jobRole", e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Senior Software Engineer"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Profile Summary</label>
                <textarea
                  value={formData.profileSummary}
                  onChange={(e) => handleInputChange("profileSummary", e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                  placeholder="Brief summary of your professional background, key skills, and career objectives..."
                />
              </div>
            </div>

            {/* Education */}
            <div className="space-y-6">
              <div className="border-b border-gray-700 pb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <GraduationCap className="mr-2 text-green-400" size={20} />
                  Education
                </h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Education Details</label>
                <textarea
                  value={formData.education}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
                  placeholder="Example:&#10;Bachelor of Computer Science&#10;Stanford University, 2020-2024&#10;GPA: 3.8/4.0"
                />
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-6">
              <div className="border-b border-gray-700 pb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Briefcase className="mr-2 text-purple-400" size={20} />
                  Work Experience
                </h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Experience Details</label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  rows="6"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                  placeholder="Example:&#10;Senior Software Engineer&#10;Google Inc. | Jan 2022 - Present&#10;• Led development of microservices architecture&#10;• Improved system performance by 40%"
                />
              </div>
            </div>

            {/* Skills & Certifications */}
            <div className="space-y-6">
              <div className="border-b border-gray-700 pb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Award className="mr-2 text-orange-400" size={20} />
                  Skills & Certifications
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Technical Skills</label>
                  <textarea
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    rows="5"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent resize-none"
                    placeholder="Example:&#10;Programming: JavaScript, Python, Java&#10;Frontend: React, Vue.js, HTML5, CSS3&#10;Backend: Node.js, Express, Django"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Certifications</label>
                  <textarea
                    value={formData.certifications}
                    onChange={(e) => handleInputChange("certifications", e.target.value)}
                    rows="5"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent resize-none"
                    placeholder="Example:&#10;AWS Certified Solutions Architect - 2024&#10;Google Cloud Professional Developer - 2023&#10;Certified Kubernetes Administrator - 2023"
                  />
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Profile Completion</span>
                <span className="text-sm font-semibold text-blue-400">{completionPercentage}%</span>
              </div>
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Complete all sections to finish your profile
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-6 py-4 border-t border-gray-700 bg-gray-900">
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors duration-200"
                >
                <Save size={18} />
                <span>{isExistingResume ? "Update Profile" : "Save Profile"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddResumeForm;