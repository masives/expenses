import * as React from 'react';

interface IProps {
  label: string;
  onChange?: () => void;
  type?: 'button' | 'submit';
}

const Button: React.FunctionComponent<IProps> = ({ label, onChange = () => {}, type = 'button' }: IProps) => (
  <button type={type} onClick={onChange}>
    {label}
  </button>
);

export default Button;
