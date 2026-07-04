import { type ReactNode } from 'react';

/* ============================================
   INPUT COMPONENT
   Dark-themed input with icon, label, error state
   ============================================ */

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: ReactNode;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  icon,
  error,
  disabled = false,
  className = '',
}: InputProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full bg-[#171717] border text-white rounded-2xl px-5 py-4
            outline-none transition-all duration-300
            placeholder:text-text-muted
            focus:border-primary focus:shadow-glow
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-danger' : 'border-border'}
          `}
          aria-label={label || placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
        />
      </div>

      {error && (
        <p
          id={`${label}-error`}
          className="text-sm text-danger flex items-center gap-1"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
