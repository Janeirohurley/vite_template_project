/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Save, Eye, Code, Upload, X, Loader2 } from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";
import { QuestionEditor } from "./QuestionEditor";
import { SurveyForm } from "./SurveyForm";
import { useCreateSurvey, useUpdateSurvey, useSurvey } from "../hooks/useSurvey";
import type { SurveyFormData, QuestionFormData } from "../types/builder";
import type { Survey } from "../types";
import { useSearch } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { notify } from "@/lib";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const initialSurvey: SurveyFormData = {
  id: "",
  title: "",
  description: "",
  multiStep: false,
  questions: [],
};

export const SurveyBuilder = () => {
  const search = useSearch({ strict: false }) as { surveyId?: string };
  const surveyId = search.surveyId;
  const { data: existingSurvey, isLoading } = useSurvey(surveyId || "");
  
  const [survey, setSurvey] = useState<SurveyFormData>(initialSurvey);
  const [previewMode, setPreviewMode] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
  const [draggedQuestionIndex, setDraggedQuestionIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<{ index: number; position: "above" | "below" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const createSurvey = useCreateSurvey();
  const updateSurvey = useUpdateSurvey();
  const isSaving = createSurvey.isPending || updateSurvey.isPending;

  useEffect(() => {
    if (existingSurvey) {
      setSurvey(existingSurvey as SurveyFormData);
      console.log(existingSurvey)
    }
  }, [existingSurvey]);

  const formatDateTimeLocal = (value?: string) => {
    if (!value) return "";

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
      return value;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const pad = (n: number) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSurveyChange = (field: keyof SurveyFormData, value: any) => {
    setSurvey({ ...survey, [field]: value });
  };

  const addQuestion = () => {
    const newQuestion: QuestionFormData = {
      id: `question_${Date.now()}`,
      label: "",
      type: "text",
      required: false,
      section: "Section 1",
    };
    setSurvey({ ...survey, questions: [...survey.questions, newQuestion] });
  };

  const updateQuestion = (index: number, question: QuestionFormData) => {
    const questions = [...survey.questions];
    questions[index] = question;
    setSurvey({ ...survey, questions });
  };

  const deleteQuestion = (index: number) => {
    const questions = survey.questions.filter((_, i) => i !== index);
    setSurvey({ ...survey, questions });
  };

  const handleQuestionDragStart = (index: number) => {
    setDraggedQuestionIndex(index);
  };

  const handleQuestionDragOver = (index: number, event: React.DragEvent<HTMLDivElement>) => {
    if (draggedQuestionIndex === null || draggedQuestionIndex === index) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetY = event.clientY - rect.top;
    const position: "above" | "below" = offsetY < rect.height / 2 ? "above" : "below";

    setDropTarget({ index, position });
  };

  const handleQuestionDrop = () => {
    if (draggedQuestionIndex === null || !dropTarget) {
      setDraggedQuestionIndex(null);
      setDropTarget(null);
      return;
    }

    setSurvey((prev) => {
      const questions = [...prev.questions];

      let insertIndex = dropTarget.index + (dropTarget.position === "below" ? 1 : 0);
      const [movedQuestion] = questions.splice(draggedQuestionIndex, 1);

      if (draggedQuestionIndex < insertIndex) {
        insertIndex -= 1;
      }

      questions.splice(insertIndex, 0, movedQuestion);
      return { ...prev, questions };
    });

    setDraggedQuestionIndex(null);
    setDropTarget(null);
  };

  const handleQuestionDragEnd = () => {
    setDraggedQuestionIndex(null);
    setDropTarget(null);
  };

  const generateCode = () => {
    const surveyObject: Survey = {
      ...survey,
      questions: survey.questions.map((q, index) => {
        const question: any = {
          id: q.id,
          label: q.label,
          type: q.type,
          section: q.section,
          order: index + 1,
        };
        if (q.required) question.required = true;
        if (q.placeholder) question.placeholder = q.placeholder;
        if (q.options) question.options = q.options;
        if (q.max) question.max = q.max;
        return question;
      }),
    };
    return `import type { Survey } from "../types";\n\nexport const survey: Survey = ${JSON.stringify(surveyObject, null, 2)};`;
  };

  const handleSave = async () => {
    const orderedQuestions = survey.questions.map((q, index) => ({
      ...(q as any),
      order: index + 1,
    }));

    const surveyData: Survey = {
      ...survey,
      questions: orderedQuestions as any,
    };
    
    try {
      if (survey.id) {
        const updatePayload = selectedFile
          ? surveyData
          : ({ ...surveyData, logo: undefined } as Survey);

        // Mise à jour
        await updateSurvey.mutateAsync({ 
          id: survey.id, 
          survey: updatePayload,
          logoFile: selectedFile || undefined 
        });
        notify.success("Sondage mis à jour avec succès !");
      } else {
        // Création
        await createSurvey.mutateAsync({ survey: surveyData, logoFile: selectedFile || undefined });
        notify.success("Sondage créé avec succès !");
      }
      setSelectedFile(null);
      setPreviewImage(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notify.error(survey.id ? "Erreur lors de la mise à jour du sondage" : "Erreur lors de la création du sondage");
    }
  };

  const handleSaveClick = async () => {
    if (!survey.title || survey.questions.length === 0 || isSaving) return;

    if (survey.id) {
      setIsUpdateConfirmOpen(true);
      return;
    }

    await handleSave();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify.error("Veuillez sélectionner une image");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const previewSurvey: Survey = {
    ...survey,
    questions: survey.questions.map((q) => ({ ...q } as any)),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Survey Builder
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleSaveClick}
              disabled={!survey.title || survey.questions.length === 0 || isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? (survey.id ? "Mise à jour..." : "Création...") : "Enregistrer"}
            </button>
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Code className="w-4 h-4" />
              {showCode ? "Masquer" : "Code"}
            </button>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? "Éditer" : "Aperçu"}
            </button>
          </div>
        </div>

        {showCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {generateCode()}
            </pre>
          </motion.div>
        )}

        {previewMode ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6"
          >
            {survey.questions.length > 0 ? (
              <SurveyForm survey={previewSurvey} onSubmit={(responses) => console.log(responses)} />
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Ajoutez des questions pour voir l'aperçu
              </p>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Informations générales
                </h2>
                <Input
                 
                  value={survey.title}
                  onChange={(e) => handleSurveyChange("title", e.target.value)}
                  placeholder="Titre du sondage"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={survey.description}
                    onChange={(e) => handleSurveyChange("description", e.target.value)}
                    placeholder="Description du sondage"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date de début
                    </label>
                    <Input
                      type="datetime-local"
                      value={formatDateTimeLocal(survey.startDate)}
                      onChange={(e) => handleSurveyChange("startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date de fin
                    </label>
                    <Input
                      type="datetime-local"
                      value={formatDateTimeLocal(survey.endDate)}
                      onChange={(e) => handleSurveyChange("endDate", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={survey.logo || ""}
                        onChange={(e) => handleSurveyChange("logo", e.target.value)}
                        placeholder="URL du logo"
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <Upload className="w-4 h-4" />
                        Choisir
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                    {(previewImage || survey.logo) && (
                      <div className="flex items-start gap-3">
                        <div className="relative inline-block">
                          <img
                            src={previewImage || survey.logo}
                            alt="Logo preview"
                            className="h-20 object-contain border border-gray-300 dark:border-gray-600 rounded p-2"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              handleSurveyChange("logo", "");
                              setPreviewImage(null);
                              setSelectedFile(null);
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Toggle
                    checked={survey.multiStep}
                    onChange={(checked) => handleSurveyChange("multiStep", checked)}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Formulaire multi-étapes
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="sticky top-4 z-20 py-3 px-3 -mx-1 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Questions ({survey.questions.length})
                  </h2>
                  <button
                    onClick={addQuestion}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une question
                  </button>
                </div>

                <AnimatePresence>
                  {survey.questions.map((question, index) => (
                    <motion.div
                      layout
                      key={question.id}
                      className="relative"
                      onDragOver={(e) => {
                        e.preventDefault();
                        handleQuestionDragOver(index, e);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleQuestionDrop();
                      }}
                      transition={{ layout: { type: "spring", stiffness: 420, damping: 30 } }}
                      style={{ zIndex: draggedQuestionIndex === index ? 5 : 1 }}
                    >
                      {dropTarget?.index === index && (
                        <div
                          className={`pointer-events-none absolute left-2 right-2 h-0.5 bg-blue-500 rounded-full ${
                            dropTarget.position === "above" ? "top-0" : "bottom-0"
                          }`}
                        />
                      )}
                      <QuestionEditor
                        question={question}
                        index={index}
                        onUpdate={updateQuestion}
                        onDelete={deleteQuestion}
                        onDragStart={() => handleQuestionDragStart(index)}
                        onDragEnd={handleQuestionDragEnd}
                        isDragging={draggedQuestionIndex === index}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {survey.questions.length === 0 && (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Aucune question ajoutée
                    </p>
                    <button
                      onClick={addQuestion}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Ajouter votre première question
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 lg:self-start">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-auto">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Sections
                </h3>
                <div className="space-y-2">
                  {Array.from(new Set(survey.questions.map((q) => q.section))).map((section) => (
                    <div
                      key={section}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{section}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {survey.questions.filter((q) => q.section === section).length} Q
                      </span>
                    </div>
                  ))}
                  {survey.questions.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      Aucune section
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={isUpdateConfirmOpen} onOpenChange={setIsUpdateConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la mise à jour</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment enregistrer les modifications de ce sondage ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void handleSave();
              }}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? "Mise à jour..." : "Confirmer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
