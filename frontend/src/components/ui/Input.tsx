interface InputProps {
    label: string
    name: string
    type: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function Input({ name, label, type, value, onChange }: InputProps) {
    return (
        <>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none focus:ring-blue-500"
                required
            />
        </>
    )
}