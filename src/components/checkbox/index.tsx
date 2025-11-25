import { forwardRef, type InputHTMLAttributes } from "react";

type Props = { label: string } & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

const CheckBox = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, label, ...rest } = props;

  return (
    <label className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 text-blue-600"
        ref={ref}
        {...rest}
      />
      <span className="ml-2 text-sm text-gray-600">{label}</span>
    </label>
  );
});

export default CheckBox;
