import { useState, useEffect } from "react"; 
import useForm, { type FormDataBase } from "../../hooks/useForm";
import useGlobalFetch from "../../hooks/useGlobalFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faUpload } from "@fortawesome/free-solid-svg-icons";

interface FormData extends FormDataBase {
  amount: number;
  date: string;
  categoryId: number;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  receipt: File | null;
  creationDate?: string;
}

interface Category {
  id: string | number;
  name: string;
}

interface ExpenseFormProps {
  existingExpense?: FormData | null;
  onSuccess?: () => void; 
}

export default function ExpenseForm({ existingExpense = null, onSuccess }: ExpenseFormProps) {
  const [isRecurring, setIsRecurring] = useState(false);

  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    success,
    error,
    loading
  } = useForm<FormData>(
    {
      amount: 0,
      date: '',
      categoryId: 0,
      description: '',
      type: 'one-time',
      receipt: null,
      creationDate: new Date().toISOString().split('T')[0],
      startDate: '',
      endDate: ''
    },
    '/expenses',
    onSuccess
  );

  useEffect(() => {
    if (existingExpense) {
      setFormData(existingExpense);
      setIsRecurring(existingExpense.type === "recurring");
    }
  }, [existingExpense, setFormData]);

  const categories = useGlobalFetch("categories");
  const categoriesData: Category[] = categories.data || [];

  const handleFormSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-white shadow-2xl w-full max-w-2xl mx-auto mt-8 p-6 rounded-2xl space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {formData.id ? "Edit Expense" : "Add Expense"}
      </h2>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          required
          value={formData.amount}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-transparent"
          placeholder="Ex: 75.50"
        />
      </div>

      {formData.type === "one-time" && (
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-transparent"
          />
        </div>
      )}

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">Category</label>
        <select
          name="categoryId"
          id="categoryId"
          required
          value={formData.categoryId}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-transparent"
        >
          <option value="">Select a category</option>
          {categoriesData.map((category: Category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">Description (optional)</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-transparent"
          placeholder="Ex: Lunch with colleagues"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-transparent"
        />
        <label className="ml-2 text-sm font-medium text-gray-700">
          Recurring Expense
        </label>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">Receipt (optional)</label>
        <input
          type="file"
          id="receipt"
          name="receipt"
          accept="image/*,application/pdf"
          onChange={handleChange}
          className="hidden"
        />
        <label
          htmlFor="receipt"
          className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
        >
          <FontAwesomeIcon icon={faUpload} className="text-gray-400 mr-2" />
          <span className="text-gray-600">Click to upload or drag and drop</span>
        </label>

        {formData.receipt && (
          <div className="flex items-center mt-3 p-2 bg-green-50 rounded-lg">
            <FontAwesomeIcon icon={faFile} className="text-green-600 mr-2" />
            <span className="text-sm text-green-800">{formData.receipt.name}</span>
          </div>
        )}

        {!formData.receipt && (
          <p className="text-sm text-gray-400 mt-2">
            <FontAwesomeIcon icon={faFile} className="mr-1" />
            No file chosen
          </p>
        )}
      </div>

      {isRecurring && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-transparent"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">End Date (optional)</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-transparent"
            />
          </div>
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {formData.id ? "Update" : "Add"}
        </button>
      </div>

      {success && (
        <p className="mt-4 text-green-700 text-sm font-medium bg-green-100 p-2 rounded">
          {success}
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-700 text-sm font-medium bg-red-100 p-2 rounded">
          {error}
        </p>
      )}
    </form>
  );
}