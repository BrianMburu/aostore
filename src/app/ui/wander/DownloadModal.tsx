import React from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
    onClose: () => void;
}

const DownloadModal: React.FC<ModalProps> = ({ onClose }) => {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    ArConnect Required
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    To use this application, you need to install the ArConnect browser extension.
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        Cancel
                    </button>
                    <a
                        href="https://arconnect.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Install ArConnect
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default DownloadModal;
