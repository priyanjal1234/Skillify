import axios from 'axios';
import ApiError from '../utils/ApiError.js';

const languageMap = {
  javascript: 63,
  c: 50,
  cpp: 54,
};

export const runCode = async (req, res, next) => {
  try {
    const { language, code } = req.body;

    const language_id = languageMap[language];
    if (!language_id) {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    const response = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      {
        language_id,
        source_code: code,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.JUDGE0_API_KEY, // ENV mein rakho
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      }
    );

    const output = response.data.stdout || response.data.stderr || 'No output';
    res.json({ output });
  } catch (error) {
    return next(new ApiError(500, error.message || 'Execution failed'));
  }
};
