import * as React from 'react';
import * as mongoose from 'mongoose';

interface IProps {
  label: string;
  onChange: (value: string) => void;
  fieldName: string;
  value: string | number;
  type?: string;
  error?: mongoose.Error;
  required?: boolean;
}

const input: React.FunctionComponent<IProps> = ({
  label,
  onChange,
  fieldName,
  type = 'text',
  value = '',
  error,
  required = false,
}: IProps) => (
  <label htmlFor={`form-element-${fieldName}`}>
    <div>
      {label}
      {error ? <span> {error.message} </span> : ''}
    </div>
    <input
      type={type}
      id={`form-element-${fieldName}`}
      onChange={(event) => onChange(event.target.value)}
      value={value}
      required={required}
    />
  </label>
);

export default input;
