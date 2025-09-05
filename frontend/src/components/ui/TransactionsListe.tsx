import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function List({ data, transaction }: { data: any[], transaction : string}) {
  const columnsToShow = ['title', 'amount', 'date', 'category'];
  const keysToDisplay = Object.keys(data[0] || {}).filter((key) =>
    columnsToShow.includes(key)
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
{
  transaction == "income"?"Income List": "Expense List"
}


      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-200 min-w-full">
            <tr>
              {keysToDisplay.map((title) => (
                <th
                  key={title}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b"
                >
                  {title}
                </th>
              ))}
              <th className="text-center border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-100 whitespace-nowrap border-b'}
              >
                {keysToDisplay.map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className="text-sm px-6 py-4 text-gray-800 "
                  >
                    {row[value]}
                  </td>
                ))}
                <td className="text-center">
                  <button
                    // onClick={() => handleEdit(row)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>

                  <button
                    // onClick={() => handleDelete(row.id)}
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
    </div>
  );
}
