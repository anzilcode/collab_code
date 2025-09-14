import Question from "../../models/Questions.js";


export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions", error: error.message });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { question, title, difficulty, category, timeEstimate } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ message: "Question text is required" });
    }
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const newQuestion = new Question({
      question: question.trim(),
      title: title.trim(),
      difficulty: difficulty || "Easy",
      category: category ? category.trim() : "",
      timeEstimate: timeEstimate ? timeEstimate.trim() : "",
      createdBy: req.user._id,
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Failed to create question", error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedQuestion = await Question.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
    });

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found or not authorized" });
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete question", error: error.message });
  }
};
