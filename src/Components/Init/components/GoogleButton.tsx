import React from 'react';
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}
/**
 *
 * @param children
 * @param attributes
 * @constructor
 */
export default function GoogleButton ({ children, ...attributes }: Props): React.JSX.Element {
  return (
        <button
            type="button"
            className="border border-gray-800 px-4 py-2 rounded uppercase"
            {...attributes}
        >
            {children}
            Google
        </button>
  );
}
