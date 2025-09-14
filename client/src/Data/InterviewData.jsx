// src/data/interviewData.js
export const candidateInfo = {
  avatar: "A", // could be initials or emoji
  name: "Anzil Albiceleste",
  email: "anzil@example.com",
  position: "Frontend Developer",
  experience: "2 years",
  location: "Kerala, India",
  skills: ["React", "JavaScript", "CSS", "Node.js"],
};

export const storedQuestions = [
  {
    title: "Reverse a String",
    category: "String Manipulation",
    difficulty: "Easy",
    timeEstimate: "10 mins",
    code: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
  },
  {
    title: "Two Sum Problem",
    category: "Arrays",
    difficulty: "Medium",
    timeEstimate: "20 mins",
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}`,
  },
];

export const languages = [
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "cpp", name: "C++" },
  { id: "java", name: "Java" },
];
