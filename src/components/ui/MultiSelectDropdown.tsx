import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';
import { Input } from './input';

interface Option {
  id: string;
  label: string;
  value?: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
  maxHeight?: string;
  isLocalSearch?: boolean;
  onSearchChange?: (searchTerm: string) => void;
  isSearching?: boolean;
}

export function MultiSelectDropdown({
  options,
  values,
  onChange,
  placeholder = "Sélectionner...",
  searchPlaceholder = "Rechercher...",
  disabled = false,
  className = "",
  label,
  required = false,
  maxHeight = "max-h-60",
  isLocalSearch = true,
  onSearchChange,
  isSearching = false
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (term: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (!isLocalSearch && onSearchChange) {
            onSearchChange(term);
          }
        }, 500);
      };
    })(),
    [isLocalSearch, onSearchChange]
  );

  const selectedOptions = options.filter(opt => values.includes(opt.id));
  
  const filteredOptions = isLocalSearch
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current?.offsetHeight || 300;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        const shouldOpenAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
        
        let left = rect.left;
        const dropdownWidth = rect.width;
        if (left + dropdownWidth > window.innerWidth) {
          left = window.innerWidth - dropdownWidth - 8;
        }
        if (left < 8) {
          left = 8;
        }
        
        setDropdownPosition({
          top: shouldOpenAbove ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
          left: left,
          width: rect.width
        });
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  const handleToggle = (optionId: string) => {
    const newValues = values.includes(optionId)
      ? values.filter(id => id !== optionId)
      : [...values, optionId];
    onChange(newValues);
  };

  const handleRemove = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(values.filter(id => id !== optionId));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div
        className={`
          flex items-center justify-between w-full min-h-[2.5rem] px-3 py-2 text-sm bg-white border border-gray-300 rounded-md cursor-pointer
          hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
          dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <span
                key={option.id}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded dark:bg-blue-900/20 dark:text-blue-400"
              >
                {option.label}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => handleRemove(option.id, e)}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded"
                  >
                    <X size={12} />
                  </button>
                )}
              </span>
            ))
          ) : (
            <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          {selectedOptions.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClearAll}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown 
            size={16} 
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed z-[9999] bg-white border border-gray-300 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`
          }}
        >
          <div className="p-2 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                className="pl-9 h-8"
                autoFocus
              />
            </div>
          </div>
          
          <div className={`${maxHeight} overflow-y-auto`}>
            {isSearching ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                Recherche en cours...
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className={`
                    flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700
                    ${values.includes(option.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  `}
                  onClick={() => handleToggle(option.id)}
                >
                  <input
                    type="checkbox"
                    checked={values.includes(option.id)}
                    onChange={() => {}}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`flex-1 ${values.includes(option.id) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    {option.label}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                Aucun résultat trouvé
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}