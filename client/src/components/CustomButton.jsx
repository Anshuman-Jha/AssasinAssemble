import React from 'react';

import styles from '../styles';

const CustomButton = ({ title, handleClick, restStyles, disabled }) => (
  <button
    type="button"
    className={`${styles.btn} ${restStyles}`}
    onClick={handleClick}
    disabled={disabled}
  >
    {title}
  </button>
);

export default CustomButton;
