import React, { useState } from 'react';
import { ChevronLeft, Shield, FileText, HelpCircle, Users, Code, Video, Calendar, BarChart3 } from 'lucide-react';
import { Link,useSearchParams } from 'react-router-dom';
import {  useEffect } from "react";

const FooterInfoPage = () => {
  const [searchParams] = useSearchParams();
  const sectionFromUrl = searchParams.get("section"); 
  const [activeSection, setActiveSection] = useState(sectionFromUrl || "privacy");

  useEffect(() => {
    if (sectionFromUrl) setActiveSection(sectionFromUrl);
  }, [sectionFromUrl]);

  const sections = {
    privacy: {
      title: 'Privacy Policy',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Information We Collect</h3>
            <p className="text-gray-300 mb-4">
              Our live collaborative interview platform collects information necessary to provide seamless interview experiences, including account details, interview recordings, code submissions, and usage analytics.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>User account information (name, email, profile activity details)</li>
              <li>Interview session data and recordings</li>
              <li>Code editor submissions and collaborative coding sessions</li>
              <li>Video call metadata and quality metrics</li>
              <li>Candidate evaluation scores and feedback</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">How We Use Your Information</h3>
            <p className="text-gray-300 mb-4">
              We use collected information to enhance your interview experience, provide analytics, and ensure platform security.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Facilitating live collaborative interviews with real-time code editing</li>
              <li>Storing and managing interview recordings for later review</li>
              <li>Generating candidate evaluation reports and analytics</li>
              <li>Improving video call quality and connection stability</li>
              <li>Managing interview sessions and scheduling</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Data Security</h3>
            <p className="text-gray-300">
              We implement industry-standard security measures to protect your interview data, including end-to-end encryption for video calls, secure storage for recordings, and regular security audits of our collaborative coding environment.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Data Retention</h3>
            <p className="text-gray-300">
              Interview recordings and code submissions are retained for 12 months unless requested for deletion. Evaluation data and session analytics may be retained longer for platform improvement purposes.
            </p>
          </div>
        </div>
      )
    },
    terms: {
      title: 'Terms of Service',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Platform Usage</h3>
            <p className="text-gray-300 mb-4">
              By using our live collaborative interview platform, you agree to use the service responsibly and in accordance with these terms.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Use the platform only for legitimate interview and evaluation purposes</li>
              <li>Maintain professional conduct during video calls and collaborative sessions</li>
              <li>Respect intellectual property rights in code submissions</li>
              <li>Ensure candidate consent for interview recordings</li>
              <li>Comply with applicable employment and privacy laws</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Acceptable Use</h3>
            <p className="text-gray-300 mb-4">
              Our platform is designed for professional interview environments with collaborative coding capabilities.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Conduct technical interviews with real-time code collaboration</li>
              <li>Record and review candidate evaluation sessions</li>
              <li>Share interview insights with authorized team members</li>
              <li>Use session management tools for scheduling and organization</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Service Availability</h3>
            <p className="text-gray-300">
              We strive to maintain 99.9% uptime for our interview platform, including video calls, code editor, and session management features. Scheduled maintenance will be announced in advance.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Account Responsibilities</h3>
            <p className="text-gray-300">
              Users are responsible for maintaining account security, managing interview sessions appropriately, and ensuring compliance with their organization's hiring practices.
            </p>
          </div>
        </div>
      )
    },
    support: {
      title: 'Support Center',
      icon: HelpCircle,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Getting Started</h3>
            <p className="text-gray-300 mb-4">
              Welcome to our live collaborative interview platform! Here's how to get the most out of your interview experience.
            </p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-400 mb-2">Quick Setup Guide</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Create your account and set up your interviewer profile</li>
                <li>Configure video and audio settings for optimal call quality</li>
                <li>Familiarize yourself with the collaborative code editor</li>
                <li>Set up your evaluation templates and scoring criteria</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Platform Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Code className="w-5 h-5 text-blue-400 mr-2" />
                  <h4 className="font-semibold text-white">Code Editor</h4>
                </div>
                <p className="text-gray-300 text-sm">Real-time collaborative coding with syntax highlighting, multiple language support, and code execution.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Video className="w-5 h-5 text-blue-400 mr-2" />
                  <h4 className="font-semibold text-white">Video Calls</h4>
                </div>
                <p className="text-gray-300 text-sm">HD video calls with screen sharing, recording capabilities, and connection quality monitoring.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-400 mr-2" />
                  <h4 className="font-semibold text-white">Evaluation Tools</h4>
                </div>
                <p className="text-gray-300 text-sm">Structured candidate evaluation with customizable scoring rubrics and report storage.</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 text-blue-400 mr-2" />
                  <h4 className="font-semibold text-white">Session Management</h4>
                </div>
                <p className="text-gray-300 text-sm">Interview scheduling, candidate invitations, and session organization with team collaboration.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Common Issues & Solutions</h3>
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-400 mb-2">Video Call Quality Issues</h4>
                <p className="text-gray-300 text-sm mb-2">If you're experiencing poor video quality:</p>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li>Check your internet connection speed</li>
                  <li>Close other bandwidth-intensive applications</li>
                  <li>Use a wired connection when possible</li>
                  <li>Adjust video quality settings in preferences</li>
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-400 mb-2">Code Editor Sync Problems</h4>
                <p className="text-gray-300 text-sm mb-2">If collaborative coding isn't syncing:</p>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  <li>Refresh the page and rejoin the session</li>
                  <li>Check for browser compatibility issues</li>
                  <li>Ensure JavaScript is enabled</li>
                  <li>Contact support if issues persist</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Contact Support</h3>
            <div className="bg-blue-900/50 p-4 rounded-lg">
              <p className="text-gray-300 mb-3">Need additional help? Our support team is available 24/7 to assist with your interview platform needs.</p>
              <ul className="text-gray-300 space-y-2">
                <li><strong>Email:</strong> contact@codecollab.com</li>
                <li><strong>Live Chat:</strong> Available in-app during business hours</li>
                <li><strong>Response Time:</strong> Within 4 hours for technical issues</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <ChevronLeft className="w-5 h-5 mr-1" />
                <Link to="/">
                    Back to Platform
                </Link>
              </button>
              <div className="h-6 w-px bg-gray-600"></div>
              <h1 className="text-xl font-semibold">CodeCollab</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>Live Collaborative Interviews</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800 rounded-lg p-4 sticky top-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-200">Information Hub</h2>
              <nav className="space-y-2">
                {Object.entries(sections).map(([key, section]) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === key
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-6">
                {React.createElement(sections[activeSection].icon, {
                  className: "w-6 h-6 text-blue-400 mr-3"
                })}
                <h1 className="text-2xl font-bold text-white">
                  {sections[activeSection].title}
                </h1>
              </div>
              
              <div className="prose prose-invert max-w-none">
                {sections[activeSection].content}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="text-center text-gray-400">
                <p className="mb-2">© 2025 CodeCollab Platform. All rights reserved.</p>
                <p className="text-sm">
                  Empowering teams with live collaborative interviews, real-time code editing, 
                  HD video calls, and comprehensive candidate evaluation tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterInfoPage;