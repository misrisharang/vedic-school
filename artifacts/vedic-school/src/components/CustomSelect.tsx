import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface CustomSelectOption {
  label: string;
  value: string;
}

export interface CustomSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: (CustomSelectOption | string)[];
  placeholder?: string;
  icon?: React.ReactNode;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  clearable?: boolean;
  clearLabel?: string;
}

export function CustomSelect({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  icon,
  hasError = false,
  disabled = false,
  className,
  ariaLabel,
  clearable = false,
  clearLabel = 'None (clear)',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const normalizedOptions: CustomSelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  return (
    <div className={cn('relative w-full', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            role="combobox"
            aria-expanded={isOpen}
            aria-label={ariaLabel || placeholder}
            disabled={disabled}
            className={cn(
              'w-full h-[52px] rounded-xl bg-white border border-[#E5DCD1] text-foreground text-[15px] sm:text-base text-left flex items-center justify-between transition-all shadow-2xs cursor-pointer select-none',
              icon ? 'pl-10 pr-10' : 'pl-4 pr-10',
              !value && 'text-foreground/40',
              hasError && 'border-primary/60 bg-primary/5 focus:border-primary',
              'focus:outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/15',
              disabled && 'opacity-60 cursor-not-allowed'
            )}
          >
            {icon && (
              <span className="absolute left-3.5 text-foreground/45 pointer-events-none flex items-center justify-center">
                {icon}
              </span>
            )}
            <span className="truncate flex-1">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className={cn(
              'w-4 h-4 text-foreground/45 pointer-events-none absolute right-3.5 transition-transform duration-200',
              isOpen && 'rotate-180 text-foreground/70'
            )} />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-1.5 bg-[#FAF6F0] border border-[#E5DCD1] rounded-2xl shadow-xl overflow-hidden z-[100]"
        >
          <div className="max-h-[260px] overflow-y-auto space-y-0.5 py-0.5" role="listbox">
            {clearable && (
              <button
                type="button"
                role="option"
                aria-selected={!value}
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-2 text-left flex items-center justify-between gap-2 rounded-lg text-xs sm:text-sm text-foreground/60 italic hover:bg-[#EAE0D2]/60 transition-colors cursor-pointer',
                  !value && 'bg-[#EAE0D2]/50 text-foreground font-medium'
                )}
              >
                <span>{clearLabel}</span>
                {!value && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
              </button>
            )}

            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left flex items-center justify-between gap-2 rounded-lg text-xs sm:text-sm text-foreground/90 hover:bg-[#EAE0D2]/70 hover:text-foreground transition-colors cursor-pointer',
                    isSelected && 'bg-[#EAE0D2]/60 font-medium text-foreground'
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
