import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)]
      overflow-y-auto overflow-x-hidden bg-white/70 backdrop-blur-sm">

      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal Box */}
        <div className="relative bg-white rounded-lg shadow-xl border border-gray-200">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t">
            <h3 className="text-lg font-semibold text-gray-800">
              {title}
            </h3>

            <button
              onClick={onClose}
              className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg w-8 h-8 flex justify-center items-center"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 14 14"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-4">{children}</div>

        </div>
      </div>
    </div>
  );
};

export default Modal;
