import {
  forwardRef,
  type DetailedHTMLProps,
  type InputHTMLAttributes,
} from "react";

export type InputType = Exclude<
  DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >["type"],
  "checkbox" | "radio"
>;

type Props = {
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { label, placeholder, type = "text", error, ...rest } = props;

  return (
    <>
      {label && (
        <label className="block text-sm font-medium text-gray-600">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        id="email"
        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder={placeholder}
        {...rest}
      />
      {error && <small className="text-red-600 my-2">{error}</small>}
    </>
  );
});

Input.displayName = "Input";

export default Input;
