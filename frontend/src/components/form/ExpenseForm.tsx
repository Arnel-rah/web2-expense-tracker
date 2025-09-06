import { useState } from "react"

export default function ExpenseForm({ existingExpense = null }) {
    const [isRecurring, setIsRecurring] = useState(false)

    return (
        <form action="">
            <label>Amount</label>
            <input type="text" required />

            <label>Date</label>
            <input type="date" required />

            <label>Source</label>
            <input type="text" required />

            <label>Desctiption</label>
            <input type="text" />


            <div className="mt-4">
                <label>
                    <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    <span className="ml-2">Recurrent</span>
                </label>
            </div>

            {isRecurring && (
                <div className="mt-4">
                    <label>Start Date</label>
                    <input type="date" required />

                    <label>End Date</label>
                    <input type="date" required />
                </div>
            )}
        </form>
    )
}