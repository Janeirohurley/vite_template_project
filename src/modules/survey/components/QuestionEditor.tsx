/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Trash2, GripVertical, Plus, X } from "lucide-react";
import { SingleSelectDropdown } from "@/components/ui/SingleSelectDropdown";
import { Toggle } from "@/components/ui/Toggle";
import type { QuestionFormData } from "../types/builder";
import { Input } from "@/components/ui/input";

interface QuestionEditorProps {
  question: QuestionFormData;
  index: number;
  onUpdate: (index: number, question: QuestionFormData) => void;
  onDelete: (index: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}

const QUESTION_TYPES = [
  { id: "text", label: "Texte court" },
  { id: "textarea", label: "Texte long" },
  { id: "radio", label: "Choix unique" },
  { id: "checkbox", label: "Choix multiple" },
  { id: "select", label: "Liste déroulante" },
  { id: "rating", label: "Notation" },
];

export const QuestionEditor = ({ question, index, onUpdate, onDelete, onDragStart, onDragEnd, isDragging = false }: QuestionEditorProps) => {
  const needsOptions = ["radio", "checkbox", "select"].includes(question.type);
  const needsMax = question.type === "rating";

  const handleChange = (field: keyof QuestionFormData, value: any) => {
    onUpdate(index, { ...question, [field]: value });
  };

  const addOption = () => {
    const options = question.options || [];
    handleChange("options", [...options, ""]);
  };

  const updateOption = (optIndex: number, value: string) => {
    const options = [...(question.options || [])];
    options[optIndex] = value;
    handleChange("options", options);
  };

  const removeOption = (optIndex: number) => {
    const options = question.options?.filter((_, i) => i !== optIndex);
    handleChange("options", options);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ layout: { type: "spring", stiffness: 420, damping: 32 } }}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4 ${isDragging ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", question.id);
            onDragStart?.();
          }}
          onDragEnd={() => onDragEnd?.()}
          className="mt-2 text-gray-400 hover:text-gray-500 cursor-grab active:cursor-grabbing"
          title="Glisser pour réorganiser"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Q{index + 1}</span>
            <Input
              value={question.label}
              onChange={(e) => handleChange("label", e.target.value)}
              placeholder="Question"
              className="flex-1"
            />
            <button
              onClick={() => onDelete(index)}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SingleSelectDropdown
              options={QUESTION_TYPES}
              value={question.type}
              onChange={(value) => handleChange("type", value)}
              placeholder="Type de question"
            />
            <Input
              value={question.section}
              onChange={(e) => handleChange("section", e.target.value)}
              placeholder="Section"
            />
          </div>

          {(question.type === "text" || question.type === "textarea") && (
            <Input
              value={question.placeholder || ""}
              onChange={(e) => handleChange("placeholder", e.target.value)}
              placeholder="Texte d'aide (optionnel)"
            />
          )}

          {needsMax && (
            <Input
              type="number"
              value={question.max || 5}
              onChange={(e) => handleChange("max", parseInt(e.target.value))}
              placeholder="Maximum"
              min={1}
              max={10}
            />
          )}

          {needsOptions && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
              {question.options?.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(optIndex, e.target.value)}
                    placeholder={`Option ${optIndex + 1}`}
                  />
                  <button
                    onClick={() => removeOption(optIndex)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addOption}
                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Ajouter une option
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Toggle
              checked={question.required}
              onChange={(checked) => handleChange("required", checked)}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Question obligatoire</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
