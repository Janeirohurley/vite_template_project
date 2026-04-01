/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@/components/ui/input';
import type { Question, SurveyResponseValue } from '../types';
import { Star } from 'lucide-react';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';
import { Toggle } from '@/components/ui/Toggle';

interface QuestionRendererProps {
  question: Question;
  value: SurveyResponseValue | undefined;
  onChange: (value: SurveyResponseValue) => void;
  error?: string;
}

export function QuestionRenderer({ question, value, onChange, error }: QuestionRendererProps) {
  const baseClasses = "w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600";

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className={baseClasses}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            rows={4}
            className={baseClasses}
          />
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {(question as any).options.map((option: string) => (
              <label 
                key={option} 
                className="flex items-center gap-3 p-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 has-checked:bg-blue-50 dark:has-checked:bg-blue-900/20 has-checked:border-blue-500"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-gray-900 dark:text-gray-100 font-normal">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {(question as any).options.map((option: string) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <Toggle
                size='sm'
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(checked) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    onChange(newValues);
                  }}
                />
                <span className="text-gray-900 dark:text-gray-100">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'select':
        return (
          <SingleSelectDropdown
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e)}
            options={(question as any).options.map((opt: string) => ({
              id: opt,
              value: opt,
              label: opt
            }))}
            placeholder="Sélectionnez une option"
            
          />
        );

      case 'rating':
        { const max = (question as any).max || 5;
        const rating = typeof value === 'number'
          ? value
          : parseInt((value as string) || '0');
        return (
          <div className="flex gap-1">
            {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                className="focus:outline-none"
              >
                <Star
                  size={24}
                  className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                />
              </button>
            ))}
          </div>
        ); }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
