"use client";

import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  Circle,
  Save,
  Pencil,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetApiAdminLessonsLessonidQuiz,
  getApiAdminLessonsLessonidQuizQueryKey,
} from "@/app/lib/generated/hooks/useGetApiAdminLessonsLessonidQuiz";
import { usePostApiAdminLessonsLessonidQuestions } from "@/app/lib/generated/hooks/usePostApiAdminLessonsLessonidQuestions";
import { usePutApiAdminQuestionsQuestionid } from "@/app/lib/generated/hooks/usePutApiAdminQuestionsQuestionid";
import { useDeleteApiAdminQuestionsQuestionid } from "@/app/lib/generated/hooks/useDeleteApiAdminQuestionsQuestionid";
import { usePostApiAdminLessonsLessonidQuestionsReorder } from "@/app/lib/generated/hooks/usePostApiAdminLessonsLessonidQuestionsReorder";

// ─── Types ─────────────────────────────────────────────────────────────────

interface QuestionOption {
  id?: number;
  option_text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  lesson_id: number;
  question_text: string;
  points: number;
  sequence: number;
  explanation?: string | null;
  options: QuestionOption[];
}

interface QuizData {
  id: number;
  title: string;
  passing_grade: number;
  duration_minutes: number;
  content_text?: string;
  questions: Question[];
}

// ─── Option row in form ─────────────────────────────────────────────────────

interface OptionFormRow {
  option_text: string;
  is_correct: boolean;
}

const EMPTY_OPTION: OptionFormRow = { option_text: "", is_correct: false };

// ─── Question Form ──────────────────────────────────────────────────────────

interface QuestionFormProps {
  initial?: Partial<Question>;
  onSave: (data: {
    question_text: string;
    points: number;
    sequence: number;
    options: OptionFormRow[];
  }) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  nextSequence: number;
}

function QuestionForm({
  initial,
  onSave,
  onCancel,
  isSaving,
  nextSequence,
}: QuestionFormProps) {
  const [questionText, setQuestionText] = useState(
    initial?.question_text ?? ""
  );
  const [points, setPoints] = useState(initial?.points ?? 10);
  const [sequence, setSequence] = useState(initial?.sequence ?? nextSequence);
  const [options, setOptions] = useState<OptionFormRow[]>(
    initial?.options && initial.options.length > 0
      ? initial.options.map((o) => ({
          option_text: o.option_text,
          is_correct: o.is_correct,
        }))
      : [EMPTY_OPTION, EMPTY_OPTION]
  );

  const addOption = () =>
    setOptions((prev) => [...prev, { option_text: "", is_correct: false }]);

  const removeOption = (idx: number) =>
    setOptions((prev) => prev.filter((_, i) => i !== idx));

  const setCorrect = (idx: number) =>
    setOptions((prev) =>
      prev.map((o, i) => ({ ...o, is_correct: i === idx }))
    );

  const updateOptionText = (idx: number, text: string) =>
    setOptions((prev) =>
      prev.map((o, i) => (i === idx ? { ...o, option_text: text } : o))
    );

  const handleSubmit = async () => {
    if (!questionText.trim()) {
      alert("Question text is required.");
      return;
    }
    const validOptions = options.filter((o) => o.option_text.trim());
    if (validOptions.length < 2) {
      alert("At least 2 options are required.");
      return;
    }
    if (!validOptions.some((o) => o.is_correct)) {
      alert("Mark at least one option as correct.");
      return;
    }
    await onSave({
      question_text: questionText,
      points,
      sequence,
      options: validOptions,
    });
  };

  return (
    <div className="bg-[#1a1a1a] border border-[rgba(212,175,53,0.2)] rounded-xl p-5 space-y-4">
      {/* Question text */}
      <div>
        <label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1.5 block">
          Question Text
        </label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Type your question here..."
          rows={3}
          className="w-full input py-2.5 resize-none text-sm"
        />
      </div>

      {/* Points + Sequence */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1.5 block">
            Points
          </label>
          <input
            type="number"
            value={points}
            min={1}
            onChange={(e) => setPoints(parseInt(e.target.value) || 10)}
            className="w-full input py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1.5 block">
            Sequence #
          </label>
          <input
            type="number"
            value={sequence}
            min={1}
            onChange={(e) => setSequence(parseInt(e.target.value) || 1)}
            className="w-full input py-2 text-sm"
          />
        </div>
      </div>

      {/* Options */}
      <div>
        <label className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider mb-2 block">
          Answer Options{" "}
          <span className="text-[#737373] normal-case font-normal">
            (click circle to mark correct)
          </span>
        </label>
        <div className="space-y-2">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {/* Correct toggle */}
              <button
                type="button"
                onClick={() => setCorrect(idx)}
                className="flex-shrink-0"
              >
                {opt.is_correct ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 text-[#404040]" />
                )}
              </button>
              <input
                type="text"
                value={opt.option_text}
                onChange={(e) => updateOptionText(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                className="flex-1 input py-2 text-sm"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="p-1.5 text-[#ef4444] hover:bg-[#ef4444]/10 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addOption}
          className="mt-2 flex items-center gap-1.5 text-sm text-[#d4af35] hover:text-[#fde047] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Option
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2 border-t border-[rgba(255,255,255,0.08)]">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2 text-sm btn-dark"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-5 py-2 text-sm btn-gradient flex items-center gap-2 font-semibold disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Question
        </button>
      </div>
    </div>
  );
}

// ─── Question Card ─────────────────────────────────────────────────────────

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isDeleting: boolean;
}

function QuestionCard({
  question,
  index,
  total,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isDeleting,
}: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-[rgba(255,255,255,0.08)] rounded-xl bg-[#171717] overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Reorder buttons */}
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-0.5 text-[#525252] hover:text-[#d4af35] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-0.5 text-[#525252] hover:text-[#d4af35] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Sequence badge */}
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#d4af35]/15 text-[#d4af35] text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>

        {/* Question text */}
        <p className="flex-1 text-sm text-white font-medium line-clamp-2 text-left">
          {question.question_text}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <span className="text-xs text-[#737373] mr-1">
            {question.points} pts
          </span>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 text-[#737373] hover:text-white hover:bg-[#262626] rounded transition-colors"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 text-[#737373] hover:text-[#d4af35] hover:bg-[#262626] rounded transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="p-1.5 text-[#737373] hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Options preview */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[rgba(255,255,255,0.06)] space-y-2">
          {question.options.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2.5">
              {opt.is_correct ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-[#404040] flex-shrink-0" />
              )}
              <span
                className={`text-sm ${
                  opt.is_correct ? "text-emerald-400 font-medium" : "text-[#a3a3a3]"
                }`}
              >
                {opt.option_text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────

interface QuizManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: number;
  lessonTitle?: string;
}

export default function QuizManagerModal({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
}: QuizManagerModalProps) {
  const queryClient = useQueryClient();

  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSavingForm, setIsSavingForm] = useState(false);

  // ── Fetch quiz + questions ──
  const {
    data: quizData,
    isLoading,
    error,
    refetch,
  } = useGetApiAdminLessonsLessonidQuiz(lessonId, {
    query: { enabled: isOpen && lessonId > 0 },
  });

  const quiz: QuizData | null = (quizData as any)?.data ?? null;
  const questions: Question[] = quiz?.questions ?? [];

  // ── Mutations ──
  const addQuestion = usePostApiAdminLessonsLessonidQuestions();
  const updateQuestion = usePutApiAdminQuestionsQuestionid();
  const deleteQuestion = useDeleteApiAdminQuestionsQuestionid();
  const reorderQuestions = usePostApiAdminLessonsLessonidQuestionsReorder();

  const invalidateQuiz = () =>
    queryClient.invalidateQueries({
      queryKey: getApiAdminLessonsLessonidQuizQueryKey(lessonId),
    });

  // ── Handlers ──
  const handleAdd = async (formData: {
    question_text: string;
    points: number;
    sequence: number;
    options: OptionFormRow[];
  }) => {
    setIsSavingForm(true);
    try {
      await addQuestion.mutateAsync({
        lessonId,
        data: formData as any,
      });
      setShowAddForm(false);
      await invalidateQuiz();
    } catch (e) {
      console.error("Failed to add question", e);
      alert("Failed to add question.");
    } finally {
      setIsSavingForm(false);
    }
  };

  const handleUpdate = async (
    questionId: number,
    formData: {
      question_text: string;
      points: number;
      sequence: number;
      options: OptionFormRow[];
    }
  ) => {
    setIsSavingForm(true);
    try {
      await updateQuestion.mutateAsync({
        questionId,
        data: formData as any,
      });
      setEditingQuestionId(null);
      await invalidateQuiz();
    } catch (e) {
      console.error("Failed to update question", e);
      alert("Failed to update question.");
    } finally {
      setIsSavingForm(false);
    }
  };

  const handleDelete = async (questionId: number) => {
    if (!confirm("Delete this question?")) return;
    setDeletingId(questionId);
    try {
      await deleteQuestion.mutateAsync({ questionId });
      await invalidateQuiz();
    } catch (e) {
      console.error("Failed to delete question", e);
      alert("Failed to delete question.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleReorder = async (reordered: Question[]) => {
    const payload = reordered.map((q, idx) => ({
      id: q.id,
      sequence: idx + 1,
    }));
    try {
      await reorderQuestions.mutateAsync({
        lessonId,
        data: { questions: payload } as any,
      });
      await invalidateQuiz();
    } catch (e) {
      console.error("Failed to reorder questions", e);
    }
  };

  const moveQuestion = (fromIdx: number, toIdx: number) => {
    const reordered = [...questions];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    handleReorder(reordered);
  };

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-[#141414] border border-[rgba(255,255,255,0.1)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#d4af35] to-transparent flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(255,255,255,0.08)] flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">Quiz Manager</h2>
            {lessonTitle && (
              <p className="text-xs text-[#737373] mt-0.5">{lessonTitle}</p>
            )}
            {quiz && (
              <div className="flex items-center gap-4 mt-1.5">
                <span className="text-xs text-[#a3a3a3]">
                  Passing grade:{" "}
                  <span className="text-[#d4af35] font-semibold">
                    {quiz.passing_grade}
                  </span>
                </span>
                <span className="text-xs text-[#a3a3a3]">
                  Duration:{" "}
                  <span className="text-[#d4af35] font-semibold">
                    {quiz.duration_minutes} min
                  </span>
                </span>
                <span className="text-xs text-[#a3a3a3]">
                  Questions:{" "}
                  <span className="text-[#d4af35] font-semibold">
                    {questions.length}
                  </span>
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#525252] hover:text-white hover:bg-[rgba(255,255,255,0.07)] rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 text-[#d4af35] animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-[#ef4444]">
              Failed to load quiz data.{" "}
              <button
                onClick={() => refetch()}
                className="underline hover:text-red-300"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && questions.length === 0 && !showAddForm && (
            <div className="text-center py-12 text-[#737373] border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl">
              <GripVertical className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No questions yet.</p>
              <p className="text-sm mt-1">
                Click "Add Question" to get started.
              </p>
            </div>
          )}

          {/* Question list */}
          {questions.map((question, idx) =>
            editingQuestionId === question.id ? (
              <QuestionForm
                key={question.id}
                initial={question}
                onSave={(data) => handleUpdate(question.id, data)}
                onCancel={() => setEditingQuestionId(null)}
                isSaving={isSavingForm}
                nextSequence={idx + 1}
              />
            ) : (
              <QuestionCard
                key={question.id}
                question={question}
                index={idx}
                total={questions.length}
                onEdit={() => {
                  setShowAddForm(false);
                  setEditingQuestionId(question.id);
                }}
                onDelete={() => handleDelete(question.id)}
                onMoveUp={() => moveQuestion(idx, idx - 1)}
                onMoveDown={() => moveQuestion(idx, idx + 1)}
                isDeleting={deletingId === question.id}
              />
            )
          )}

          {/* Add Question form */}
          {showAddForm && (
            <QuestionForm
              onSave={handleAdd}
              onCancel={() => setShowAddForm(false)}
              isSaving={isSavingForm}
              nextSequence={questions.length + 1}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-[#737373]">
            Use ▲ ▼ arrows to reorder questions
          </span>
          <button
            onClick={() => {
              setEditingQuestionId(null);
              setShowAddForm(true);
            }}
            disabled={showAddForm}
            className="px-5 py-2.5 btn-gradient flex items-center gap-2 text-sm font-semibold disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}
