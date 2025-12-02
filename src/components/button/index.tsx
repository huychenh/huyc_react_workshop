import type { ButtonHTMLAttributes, ReactNode } from "react";

export type Props = {
  children?: ReactNode;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: Props) => {
  const { children, isLoading = false, ...rest } = props;

  return (
    <button
      type="submit"
      className="w-full flex items-center  justify-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      {...rest}
    >
      {isLoading && (
        <div
          role="spinbutton"
          className="h-5 w-5 border-4 mr-3 border-white border-t-transparent rounded-full animate-spin"
        ></div>
      )}
      {children}
    </button>
  );
};

export default Button;
