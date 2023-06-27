import * as React from 'react';
import { FaSpinner } from 'react-icons/fa';

export function Loader() {
  return (
    <div className="spinner">
      <FaSpinner className="spinner-icon" />
    </div>
  );
}