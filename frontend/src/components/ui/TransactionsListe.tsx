import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

interface DataRow {
  [key: string]: any;
  id?: number | string;
}

interface ListProps {
  data: DataRow[];
  transaction: string;
  loading: boolean;
  err: string | null;
  onEdit?: (row: DataRow) => void; 
  onDelete?: (id: number | string) => void; 
}

export default function List({ data, transaction, loading, err, onEdit, onDelete }: ListProps) {
  const columnsToShow = transaction === "income" 
    ? ['amount', 'date', 'source', 'description'] 
    : ['amount', 'date', 'categoryId', 'description', 'type'];
  
  const keysToDisplay = data && data.length > 0 
    ? Object.keys(data[0]).filter((key) => columnsToShow.includes(key))
    : [];

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        {transaction === "income" ? "Income List" : "Expense List"}
      </h1>

      {loading || err ? (
        <div className={`text-center p-4 rounded-md ${err ? "bg-red-400 text-white" : "bg-gray-200 text-gray-800"}`}>
          {loading ? "Loading..." : "An error occurred while fetching the data."}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center p-4 bg-yellow-50 text-yellow-800 rounded-md">
          No {transaction} data found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                {keysToDisplay.map((title) => (
                  <th key={title} className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                    {title}
                  </th>
                ))}
                <th className="text-center border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row: DataRow, rowIndex: number) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100 whitespace-nowrap border-b'}>
                  {keysToDisplay.map((key: string, colIndex: number) => (
                    <td key={colIndex} className="text-sm px-6 py-4 text-gray-800">
                      {row[key]}
                    </td>
                  ))}
                  <td className="text-center">
                    <button
                      onClick={() => onEdit && onEdit(row)} 
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(row.id)} 
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}