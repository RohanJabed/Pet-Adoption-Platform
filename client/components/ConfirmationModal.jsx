import { FiX, FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmationModal({
  title, message, onConfirm, onCancel,
  confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 pt-6 pb-3">
          <div className="flex items-center gap-3">
            {isDanger && <FiAlertTriangle className="text-red-500 text-2xl" />}
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h2>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl flex items-center transition-colors">
            <FiX />
          </button>
        </div>

        <div className="px-6 pb-6">
          <p className="text-gray-500 text-sm">{message}</p>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all hover:-translate-y-0.5 ${isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-violet-600 hover:bg-violet-700'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
