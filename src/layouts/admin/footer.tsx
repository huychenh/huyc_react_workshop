import React from "react";

type FooterProps = {
  className?: string;
  children?: React.ReactNode;
};

const Footer: React.FC<FooterProps> = ({ className, children }) => {
  return (
    <footer
      className={`bg-white shadow-inner p-4 text-center text-gray-500 text-sm ${className || ""}`}
    >
      {children || "© 2025 Simple KYC. All rights reserved."}
    </footer>
  );
};

export default Footer;
