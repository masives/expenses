import * as React from 'react';
import * as mongoose from 'mongoose';

interface IProps {
  label: string;
  onChange: (value: string) => void;
  fieldName: string;
  value: string | number;
  type?: string;
  error?: mongoose.Error;
}

const input: React.FunctionComponent<IProps> = ({
  label,
  onChange,
  fieldName,
  type = 'text',
  value = '',
  error,
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
    />
  </label>
);

export default input;
