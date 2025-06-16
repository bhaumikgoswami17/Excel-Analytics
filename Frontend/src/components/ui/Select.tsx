import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  label,
  error,
  className = '',
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange && onChange(e.target.value);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={`block w-full rounded-md border-gray-300 border py-2 px-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        onChange={handleChange}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;