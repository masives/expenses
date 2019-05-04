import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import './index.scss';
interface IProps {
  icon: IconDefinition;
  onChange: () => void;
}

const IconButton: React.FunctionComponent<IProps> = ({ icon, onChange }: IProps) => {
  return (
    <button className="icon-button" type="button" onClick={onChange}>
      <FontAwesomeIcon icon={icon} size="2x" />
    </button>
  );
};

export default IconButton;
