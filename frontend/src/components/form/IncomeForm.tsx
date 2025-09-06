import useForm, { type FormDataBase } from "../../hooks/useForm";

interface FormData extends FormDataBase{
  amount: number;
  date: string;
  source: string;
  description: string;
  creationDate?: string;
}

export default function IncomeForm ({ existingIncome = null }) {
  const {
    formData,
    handleChange,
    handleSubmit,
    success,
    error,
    loading
  } = useForm<FormData>(
    existingIncome || {
      amount: 0,
      date: '',
      source: '',
      description: ''
    },
    '/incomes'
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-2xl w-full max-w-2xl mx-auto mt-8 p-6 rounded-2xl space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {formData.id ? "Modifier un revenu" : "Ajouter un revenu"}
      </h2>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">Montant</label>
        <input
          type="number"
          id="amount"
          name="amount"
          required
          value={formData.amount}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ex: 1200"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          required
          value={formData.date}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">Source</label>
        <input
          type="text"
          id="source"
          name="source"
          required
          value={formData.source}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ex: Salaire, Freelance, etc."
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Optionnel"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          {loading ? 'Chargement...' : (formData.id ? "Mettre à jour" : "Ajouter")}
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