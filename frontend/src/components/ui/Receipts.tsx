import { useState } from 'react';
import { useReceipts } from '../../hooks/useReceipts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

interface ReceiptComponentProps {
  expenseId: string;
}

export const ReceiptComponent = ({ expenseId }: ReceiptComponentProps) => {
  const [downloadFormat] = useState<'application/pdf' | 'image/jpeg' | 'image/png'>('application/pdf');
  const { loading, downloadReceipt } = useReceipts();

  const handleDownload = async () => {
    if (!expenseId) {
      import('react-hot-toast').then(({ toast }) => {
        toast.error('ID de dépense manquant');
      });
      return;
    }

    try {
      await downloadReceipt(expenseId, downloadFormat);
    } catch (err) {
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading || !expenseId}
      className="bg-blue-600 text-white p-2 rounded-md hover:bg-zinc-500 disabled:bg-gray-400 transition-colors flex items-center cursor-pointer"
      title="Télécharger le reçu"
    >
      <FontAwesomeIcon icon={faDownload} />
    </button>
  );
};