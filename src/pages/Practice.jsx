import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"

export default function Practice() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [revealedAnswers, setRevealedAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState({})
  const [feedback, setFeedback] = useState({})

  useEffect(() => {
    fetchRandomQuestions()
  }, [])

  const fetchRandomQuestions = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch all questions first
      const { data, error } = await supabase
        .from('questions')
        .select('*')

      if (error) throw error

      // Shuffle and select 10 random questions
      const shuffled = data.sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, 10)

      setQuestions(selected)
      setRevealedAnswers({}) // Reset revealed answers
      setAnswers({})
      setResults({})
    } catch (err) {
      console.error('Error fetching questions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleAnswer = (questionId) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  const startNewPractice = () => {
    fetchRandomQuestions()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <div className="text-red-600 mb-4">
            <h2 className="text-xl font-bold text-center">Error Loading Questions</h2>
          </div>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={fetchRandomQuestions}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">USCIS Civics Test Practice</h1>
              <p className="text-gray-600 mt-1">Answer 6 out of 10 questions correctly to pass</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {questions.map((q, index) => {
            const status = results[q.id]
            const bgColor =
              status === "correct"
                ? "bg-green-200"
                : status === "incorrect"
                  ? "bg-red-200"
                  : "bg-white"

            return (
              <div key={q.id} className={`${bgColor} rounded-xl shadow-md p-6 hover:shadow-lg transition`}>
                {/* Question Number & Category */}
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">
                    Question {index + 1} of 10
                  </span>
                  <span className="text-xs text-gray-500">{q.category}</span>
                </div>

                {/* Question Number USCIS */}
                <div className="mb-2">
                  <span className="text-xs text-gray-400">USCIS #{q.question_number}</span>
                </div>

                {/* Question Text */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {q.question}
                </h3>

                {/* Answer Input */}
                <input
                  id="answer"
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="Type your answer ... "
                  className="input-field mb-3"
                />

                {/* Submit Button */}
                <button
                  className="button-primary mb-3"
                  onClick={() => {
                    const userAnswer = (answers[q.id] || "").trim().toLowerCase()
                    const correct = q.answers.some(
                      (a) => a.trim().toLowerCase() === userAnswer
                    )

                    setResults((prev) => ({
                      ...prev,
                      [q.id]: correct ? "correct" : "incorrect",
                    }))

                    setFeedback((prev) => ({
                      ...prev,
                      [q.id]: correct ? "Correct!" : "Incorrect!",
                    }))

                    // Automatically clear it after 1 second
                    setTimeout(() => {
                      setFeedback((prev) => {
                        const updated = { ...prev }
                        delete updated[q.id]
                        return updated
                      })
                    }, 1000)

                  }}
                >
                  Submit Answer
                </button>


                {/* Show feedback */}
                {feedback[q.id] && (
                  <p
                    className={`text-center text-med mb-3 font-semibold ${
                      feedback[q.id] === "Correct!" ? "text-green-800" : "text-red-600"
                    } transition-opacity duration-500`}
                  >
                    {feedback[q.id]}
                  </p>
                )}



                {/* Show/Hide Answer Button */}
                <button
                  onClick={() => toggleAnswer(q.id)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition mb-3"
                >
                  {revealedAnswers[q.id] ? "Hide Answer" : "Show Answer"}
                </button>

                {/* Answer (revealed) */}
                {revealedAnswers[q.id] && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                    <p className="text-sm font-semibold text-green-800 mb-2">Answer:</p>
                    <ul className="space-y-1">
                      {q.answers.map((answer, idx) => (
                        <li key={idx} className="text-green-900">
                          • {answer}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )


          })}
        </div>

        {/* Points Summary */}
        <div className="form-container mt-5 text-gray-500">
          <p className="text-blue-900 text-center font-semibold">
            You got {Object.values(results).filter((r) => r === "correct").length
            } out of 10 correct
          </p>
        </div>


        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={startNewPractice}
            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md"
          >
            New Practice Set
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}