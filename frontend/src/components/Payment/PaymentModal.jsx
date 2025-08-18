import React, { useState } from 'react';

const PaymentModal = ({ isOpen, onClose, darkMode, selectedPlan }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`max-w-md w-full mx-4 rounded-2xl shadow-xl ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border`}>
        {/* Контент буде додано далі */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
            Upgrade to Pro
          </h3>
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;