import useForm from "../../hooks/useForm"

export default function IncomeForm({ existingIncome = null }) {

    const {
        formData,
        handleChange,
        handleSubmit,
        success,
        error
    } = useForm(
        existingIncome || {
            amount: 0,
            date: '',
            source: '',
            description: ''
        },
        '/income'
    )

    return (
        <form onSubmit={handleSubmit} className="flex flex-col p-4 w-100 m-auto bg-amber-500">
            <label>Amount</label>
            <input
                type="number"
                id="amount"
                name="amount"
                required
                value={formData.amount}
                onChange={handleChange}
            />

            <label>Date</label>
            <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
            />

            <label>Source</label>
            <input
                type="text"
                id="source"
                name="source"
                required
                value={formData.source}
                onChange={handleChange}
            />

            <label>Desctiption</label>
            <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
            />

            <button type="submit" className="mt-4 bg-black text-white p-2 rounded">
                {formData.id ? "Mettre à jour" : "Ajouter"}
            </button>

            {success && <p className="text-green-700">{success}</p>}
            {error && <p className="text-red-700">{error}</p>}


        </form>
    )
}