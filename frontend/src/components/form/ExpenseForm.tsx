import { useState, useEffect } from "react";
import useForm, { type FormDataBase } from "../../hooks/useForm";
import useGlobalFetch from "../../hooks/useGlobalFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faUpload } from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../api/api";
import toast from "react-hot-toast";

interface FormData extends FormDataBase {
  expense_id?: number;
  amount: number;
  date: string;
  categoryId: number | string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  receipt: File | null;
  creationDate?: string;
  newCategory?: string;
}

interface Category {
  category_id: string | number;
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
      endDate: '',
      newCategory: ''
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
    e.preventDefault();

    let finalCategoryId: number = Number(formData.categoryId);

    if (formData.categoryId === "new" && formData.newCategory) {
      try {
        const newCat = await apiFetch("/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formData.newCategory }),
        });
        finalCategoryId = newCat.category_id;
      } catch {
        toast.error("Failed to create category");
        return;
      }
    }

    const apiData = {
      amount: String(formData.amount),
      date: formData.date,
      category_id: finalCategoryId,
      description: formData.description,
      type: formData.type,
      start_date: formData.startDate || null,
      end_date: formData.endDate || null,
    };

    try {
      const method = formData.expense_id ? "PUT" : "POST";
      const endpoint = formData.expense_id ? `/expenses/${formData.expense_id}` : "/expenses";

      await apiFetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      toast.success("Expense submitted successfully")
      if (onSuccess) onSuccess();
    } catch {
      toast.error("Failed to submit expense");
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-white shadow-2xl w-full max-w-2xl mx-auto mt-8 p-6 rounded-2xl space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {formData.expense_id ? "Edit Expense" : "Add Expense"}
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
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {categoriesData.map((category: Category) => (
            <option key={category.category_id} value={category.category_id}>{category.name}</option>
          ))}

          <option value="new">+ Add new category</option>
        </select>

        {formData.categoryId === "new" && (
          <input
            type="text"
            name="newCategory"
            required
            placeholder="Enter new category"
            value={formData.newCategory}
            onChange={handleChange}
            className="mt-2 border border-gray-300 rounded-lg p-2 w-full"
          />
        )}
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">Description (optional)</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Lunch with colleagues"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {formData.expense_id ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}