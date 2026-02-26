"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Award,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useGetApiLessonsLessonidQuestionsSeq,
  usePostApiLessonsLessonidSubmitQuiz,
} from "@/app/lib/generated/hooks";
import apiClient from "@/app/lib/api-client";

interface QuizContentProps {
  lessonId: number;
  lessonTitle: string;
  onPassed: () => void;
}

export default function QuizContent({
  lessonId,
  lessonTitle,
  onPassed,
}: QuizContentProps) {
  const [step, setStep] = useState<"start" | "questions" | "result">("start");
  const [currentSeq, setCurrentSeq] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [reviewData, setReviewData] = useState<any>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  // Fetch current question
  const {
    data: questionData,
    isLoading: isQuestionLoading,
    isError: isQuestionError,
  } = useGetApiLessonsLessonidQuestionsSeq(lessonId, currentSeq, {
    query: {
      enabled: step === "questions",
    },
  });

  const submitQuizMutation = usePostApiLessonsLessonidSubmitQuiz();

  const handleStart = () => {
    setStep("questions");
    setCurrentSeq(1);
    setAnswers({});
  };

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNextQuestion = () => {
    if (questionData?.data) {
      if (currentSeq < (questionData.total_questions || 1)) {
        setCurrentSeq((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentSeq > 1) {
      setCurrentSeq((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Format answers as required by API: { "1": 5 } where "1" is question number/id?
      // The example shows "answers": { "1": 5 }. Let's assume keys are question IDs.
      const formattedAnswers: Record<string, number> = {};
      Object.entries(answers).forEach(([qId, oId]) => {
        formattedAnswers[qId] = oId;
      });

      const response = await submitQuizMutation.mutateAsync({
        lessonId,
        data: {
          answers: formattedAnswers as any, // Type-casting because of generated type mismatch
        },
      });

      // Based on typical response, we get attempt_id
      const newAttemptId = response?.data?.attempt_id || response?.attempt_id;
      if (newAttemptId) {
        setAttemptId(newAttemptId);
        fetchReview(newAttemptId);
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  const fetchReview = async (id: number) => {
    setIsReviewLoading(true);
    try {
      const response = await apiClient.get(`/api/quiz-attempts/${id}/review`);
      setReviewData(response.data.data);
      setStep("result");

      if (response.data.data.passed) {
        onPassed();
      }
    } catch (error) {
      console.error("Failed to fetch quiz review:", error);
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleRetry = () => {
    setStep("start");
    setAttemptId(null);
    setReviewData(null);
    setAnswers({});
    setCurrentSeq(1);
  };

  if (step === "start") {
    return (
      <div className="card p-12 text-center flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="h-20 w-20 bg-[#d4af35]/10 rounded-full flex items-center justify-center mb-2">
          <Award className="h-10 w-10 text-[#d4af35]" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Quiz: {lessonTitle}
          </h3>
          <p className="text-[#a3a3a3] max-w-md mx-auto">
            Test your knowledge on this module. You need to reach the passing
            grade to continue to the next lesson.
          </p>
        </div>
        <button
          onClick={handleStart}
          className="btn btn-primary px-10 py-3 font-bold text-lg"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (step === "questions") {
    const currentQuestion = questionData?.data;
    const totalQuestions = questionData?.total_questions || 1;
    const isLastQuestion = currentSeq === totalQuestions;
    const isAnswered = currentQuestion ? !!answers[currentQuestion.id] : false;

    return (
      <div className="card overflow-hidden animate-in fade-in duration-300">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-[#262626]">
          <div
            className="h-full bg-gradient-to-r from-[#d4af35] to-[#fde047] transition-all duration-500"
            style={{ width: `${(currentSeq / totalQuestions) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <span className="text-sm font-medium text-[#d4af35] bg-[#d4af35]/10 px-3 py-1 rounded-full border border-[#d4af35]/20">
              Question {currentSeq} of {totalQuestions}
            </span>
            <div className="flex items-center gap-2 text-[#737373] text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Select the best answer</span>
            </div>
          </div>

          {isQuestionLoading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 text-[#d4af35] animate-spin" />
              <p className="text-[#737373]">Loading question...</p>
            </div>
          ) : isQuestionError ? (
            <div className="py-20 text-center">
              <p className="text-red-400 mb-4">Failed to load question.</p>
              <button
                onClick={() => setCurrentSeq(currentSeq)}
                className="btn btn-ghost"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h4 className="text-xl font-semibold text-white mb-8 leading-relaxed">
                {currentQuestion?.question}
              </h4>

              <div className="grid gap-4">
                {currentQuestion?.options?.map((option: any) => {
                  const isSelected = answers[currentQuestion.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() =>
                        handleOptionSelect(currentQuestion.id, option.id)
                      }
                      className={`w-full p-4 text-left rounded-xl border transition-all duration-200 flex items-center gap-4 ${
                        isSelected
                          ? "bg-[#d4af35]/10 border-[#d4af35] text-white shadow-[0_0_15px_rgba(212,175,53,0.1)]"
                          : "bg-[#1a1a1a] border-[rgba(255,255,255,0.08)] text-[#d4d4d4] hover:bg-[#262626] hover:border-[rgba(255,255,255,0.15)]"
                      }`}
                    >
                      <div
                        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "border-[#d4af35] bg-[#d4af35]"
                            : "border-[#404040]"
                        }`}
                      >
                        {isSelected && (
                          <div className="h-2.5 w-2.5 bg-black rounded-full" />
                        )}
                      </div>
                      <span className="text-base">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-12 pt-8 border-t border-[rgba(255,255,255,0.08)]">
            <button
              onClick={handlePrevQuestion}
              disabled={currentSeq === 1}
              className="flex items-center gap-2 px-6 py-2.5 text-[#a3a3a3] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-medium"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={!isAnswered || submitQuizMutation.isPending}
              className={`btn ${isLastQuestion ? "btn-primary" : "bg-[#262626] hover:bg-[#333] text-white"} px-8 py-2.5 font-bold flex items-center gap-2 disabled:opacity-50`}
            >
              {submitQuizMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : isLastQuestion ? (
                "Submit Quiz"
              ) : (
                <>
                  Next Question
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "result") {
    const passed = reviewData?.passed;
    const score = parseFloat(reviewData?.score || "0");
    const passingGrade = reviewData?.passing_grade || 75;

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Result Header Card */}
        <div
          className={`card p-10 text-center border-t-4 ${passed ? "border-t-green-500" : "border-t-red-500"}`}
        >
          <div
            className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed
                ? "bg-green-500/10 text-green-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {passed ? (
              <CheckCircle className="h-12 w-12" />
            ) : (
              <XCircle className="h-12 w-12" />
            )}
          </div>

          <h3 className="text-3xl font-bold text-white mb-2">
            {passed ? "Congratulations! You Passed" : "Quiz Not Passed"}
          </h3>
          <p className="text-[#a3a3a3] mb-8">
            {passed
              ? "Excellent work! You can now proceed to the next lesson."
              : `Don't worry, you can try again. You need ${passingGrade} to pass this lesson.`}
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
              <p className="text-[#737373] text-xs uppercase tracking-wider mb-1">
                Your Score
              </p>
              <p
                className={`text-2xl font-bold ${passed ? "text-green-400" : "text-red-400"}`}
              >
                {score}%
              </p>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
              <p className="text-[#737373] text-xs uppercase tracking-wider mb-1">
                Status
              </p>
              <p
                className={`text-2xl font-bold ${passed ? "text-green-400" : "text-red-400"}`}
              >
                {passed ? "Pass" : "Fail"}
              </p>
            </div>
          </div>

          {!passed && (
            <button
              onClick={handleRetry}
              className="btn btn-primary px-10 py-3 font-bold flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="h-5 w-5" />
              Retry Quiz
            </button>
          )}
        </div>

        {/* Detailed Review */}
        <div className="card p-8">
          <h4 className="text-xl font-bold text-white mb-6">Quiz Review</h4>
          <div className="space-y-6">
            {reviewData?.detailed_answers?.map((item: any, index: number) => (
              <div
                key={index}
                className="p-6 bg-[#1a1a1a] rounded-xl border border-[rgba(255,255,255,0.05)]"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h5 className="text-[#e5e5e5] font-medium leading-relaxed">
                    {index + 1}. {item.question_text}
                  </h5>
                  {item.is_correct ? (
                    <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full shrink-0">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-2.5 py-1 rounded-full shrink-0">
                      <XCircle className="h-3.5 w-3.5" />
                      Incorrect
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-black/20 border border-[rgba(255,255,255,0.03)]">
                    <p className="text-xs text-[#737373] mb-1">Your Answer</p>
                    <p
                      className={`text-sm ${item.is_correct ? "text-green-400" : "text-red-400"}`}
                    >
                      {item.user_answer?.text || "Not answered"}
                    </p>
                  </div>
                  {!item.is_correct && (
                    <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                      <p className="text-xs text-green-500/50 mb-1">
                        Correct Answer
                      </p>
                      <p className="text-sm text-green-400">
                        {item.correct_answer?.text}
                      </p>
                    </div>
                  )}
                  {item.explanation && (
                    <div className="mt-4 p-4 bg-[#d4af35]/5 border-l-2 border-[#d4af35] rounded-r-lg text-sm text-[#d4d4d4] italic">
                      {item.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
