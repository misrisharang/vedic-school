import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, Phone, Search, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Country,
  COUNTRIES,
  POPULAR_COUNTRY_CODES,
} from '@/data/countries';
import { cn } from '@/lib/utils';

export interface WhatsAppPhoneInputProps {
  id?: string;
  country: Country;
  onCountryChange: (country: Country) => void;
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  error?: string;
  themeColor?: 'terracotta' | 'olive';
  disabled?: boolean;
  required?: boolean;
}

export function WhatsAppPhoneInput({
  id = 'whatsapp-number-input',
  country,
  onCountryChange,
  phoneNumber,
  onPhoneNumberChange,
  error,
  themeColor = 'terracotta',
  disabled = false,
  required = true,
}: WhatsAppPhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Auto focus search input when popover opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filter countries according to search term
  const { popularCountries, allCountries, filteredCountries, isSearching } = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    const cleanDigits = trimmed.replace(/\D/g, '');

    if (!trimmed) {
      const popular = POPULAR_COUNTRY_CODES.map((code) =>
        COUNTRIES.find((c) => c.code === code)
      ).filter(Boolean) as Country[];

      return {
        popularCountries: popular,
        allCountries: COUNTRIES,
        filteredCountries: COUNTRIES,
        isSearching: false,
      };
    }

    const filtered = COUNTRIES.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(trimmed);
      const codeMatch = c.code.toLowerCase() === trimmed;
      const dialDigits = c.dialCode.replace(/\D/g, '');
      const dialMatch =
        c.dialCode.includes(trimmed) ||
        (cleanDigits && dialDigits.startsWith(cleanDigits));

      return nameMatch || codeMatch || dialMatch;
    });

    return {
      popularCountries: [],
      allCountries: [],
      filteredCountries: filtered,
      isSearching: true,
    };
  }, [searchQuery]);

  const handleSelect = (selected: Country) => {
    onCountryChange(selected);
    setIsOpen(false);
    // Focus phone input immediately after selection
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 50);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow digits, spaces, parentheses, hyphens, and leading plus
    if (/^[0-9\s\-()+]*$/.test(val)) {
      onPhoneNumberChange(val);
    }
  };

  const activeFocusRing =
    themeColor === 'olive'
      ? 'focus:bg-white focus:outline-none focus:border-[#4F684C]/70 focus:ring-2 focus:ring-[#4F684C]/15'
      : 'focus:bg-white focus:outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/15';

  const hasError = Boolean(error);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        {/* Country Selector Dropdown Trigger */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              aria-label={`Selected country: ${country.name} (${country.dialCode}). Click to change.`}
              className={cn(
                'h-[50px] sm:h-[52px] px-2.5 sm:px-3 rounded-xl bg-white/70 border border-[#E5DCD1] text-foreground hover:bg-white flex items-center justify-between gap-1.5 transition-all shadow-2xs cursor-pointer select-none shrink-0',
                'w-[136px] sm:w-[172px]',
                activeFocusRing,
                hasError && 'border-primary/60 bg-primary/5',
                disabled && 'opacity-60 cursor-not-allowed'
              )}
            >
              <span className="text-base sm:text-lg leading-none shrink-0 select-none">
                {country.flag}
              </span>
              <span className="font-normal text-xs sm:text-sm text-foreground/90 truncate text-left flex-1 min-w-0">
                {country.name}
              </span>
              <span className="text-[11px] sm:text-xs text-foreground/65 font-medium shrink-0 font-mono">
                ({country.dialCode})
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-foreground/45 shrink-0 ml-0.5" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            sideOffset={6}
            className="w-[300px] sm:w-[350px] p-0 bg-[#FAF6F0] border border-[#E5DCD1] rounded-2xl shadow-xl overflow-hidden z-[100]"
          >
            {/* Search Input Box */}
            <div className="p-2.5 border-b border-[#E8DFCFA0] bg-white/70 sticky top-0 z-10 backdrop-blur-xs">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-foreground/45 absolute left-3 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search country or code (+91, +44)..."
                  className={cn(
                    'w-full pl-9 pr-7 py-2 text-xs sm:text-sm bg-white/90 border border-[#E5DCD1] rounded-xl text-foreground placeholder:text-foreground/45 transition-all shadow-2xs',
                    activeFocusRing
                  )}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-foreground/40 hover:text-foreground text-xs p-1"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Country List */}
            <div className="max-h-[290px] overflow-y-auto divide-y divide-[#EFE7DC]/50 overscroll-contain">
              {isSearching ? (
                filteredCountries.length === 0 ? (
                  <div className="py-8 text-center text-xs sm:text-sm text-foreground/55">
                    No matching countries found
                  </div>
                ) : (
                  filteredCountries.map((c) => {
                    const isSelected = c.code === country.code && c.dialCode === country.dialCode;
                    return (
                      <button
                        key={`${c.code}-${c.dialCode}`}
                        type="button"
                        onClick={() => handleSelect(c)}
                        className={cn(
                          'w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs sm:text-sm hover:bg-white/85 transition-colors cursor-pointer',
                          isSelected && (themeColor === 'olive' ? 'bg-[#4F684C]/10 font-medium' : 'bg-primary/10 font-medium')
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span className="text-lg leading-none shrink-0 select-none">{c.flag}</span>
                          <span className="truncate text-foreground/90">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-foreground/60 font-mono text-xs">{c.dialCode}</span>
                          {isSelected && (
                            <Check className={cn('w-4 h-4 shrink-0', themeColor === 'olive' ? 'text-[#4F684C]' : 'text-primary')} />
                          )}
                        </div>
                      </button>
                    );
                  })
                )
              ) : (
                <>
                  {/* Active student regions: LEARNING WITH ME, WORLDWIDE */}
                  <div>
                    <div className="px-3.5 py-2 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-foreground/80 bg-[#F4EFEA] border-b border-[#EFE7DC] sticky top-0 z-5">
                      LEARNING WITH ME, WORLDWIDE
                    </div>
                    {popularCountries.map((c) => {
                      const isSelected = c.code === country.code && c.dialCode === country.dialCode;
                      return (
                        <button
                          key={`pop-${c.code}-${c.dialCode}`}
                          type="button"
                          onClick={() => handleSelect(c)}
                          className={cn(
                            'w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs sm:text-sm hover:bg-white/85 transition-colors cursor-pointer',
                            isSelected && (themeColor === 'olive' ? 'bg-[#4F684C]/10 font-medium' : 'bg-primary/10 font-medium')
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="text-lg leading-none shrink-0 select-none">{c.flag}</span>
                            <span className="truncate text-foreground/90">{c.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-foreground/60 font-mono text-xs">{c.dialCode}</span>
                            {isSelected && (
                              <Check className={cn('w-4 h-4 shrink-0', themeColor === 'olive' ? 'text-[#4F684C]' : 'text-primary')} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* All Other Countries & Territories */}
                  <div>
                    <div className="px-3.5 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-foreground/50 bg-[#F4EFEA]/80 sticky top-0 z-5">
                      All Other Countries & Territories ({allCountries.length})
                    </div>
                    {allCountries.map((c) => {
                      const isSelected = c.code === country.code && c.dialCode === country.dialCode;
                      return (
                        <button
                          key={`all-${c.code}-${c.dialCode}`}
                          type="button"
                          onClick={() => handleSelect(c)}
                          className={cn(
                            'w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs sm:text-sm hover:bg-white/85 transition-colors cursor-pointer',
                            isSelected && (themeColor === 'olive' ? 'bg-[#4F684C]/10 font-medium' : 'bg-primary/10 font-medium')
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="text-lg leading-none shrink-0 select-none">{c.flag}</span>
                            <span className="truncate text-foreground/90">{c.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-foreground/60 font-mono text-xs">{c.dialCode}</span>
                            {isSelected && (
                              <Check className={cn('w-4 h-4 shrink-0', themeColor === 'olive' ? 'text-[#4F684C]' : 'text-primary')} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* WhatsApp Phone Number Input */}
        <div className="relative flex-1 min-w-0 flex items-center">
          <Phone className="w-4 h-4 text-foreground/45 pointer-events-none absolute left-3.5" />
          <input
            ref={phoneInputRef}
            id={id}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="WhatsApp number"
            disabled={disabled}
            className={cn(
              'w-full h-[50px] sm:h-[52px] pl-10 pr-4 rounded-xl bg-white/70 border border-[#E5DCD1] text-foreground placeholder:text-foreground/40 text-sm sm:text-base transition-all shadow-2xs',
              activeFocusRing,
              hasError && 'border-primary/60 bg-primary/5 focus:border-primary',
              disabled && 'opacity-60 cursor-not-allowed'
            )}
            required={required}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-primary text-xs mt-1.5 flex items-center gap-1 font-medium">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
}
