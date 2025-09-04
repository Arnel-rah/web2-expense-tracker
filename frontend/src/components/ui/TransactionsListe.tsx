import { useState } from 'react';

export default function List({ data }: { data: any[] }) {
  const columnsToShow = ['description', 'amount', 'date', 'type'];
  const keysToDisplay = Object.keys(data[0] || {}).filter((key) => columnsToShow.includes(key));
  const [filter, setFilter] = useState<string>('all');

  const filteredData = filter === 'all' ? data : data.filter((row) => row.type === filter);

  return (
    <div>
      <h1>Liste des Transactions</h1>
      
      <div className='flex justify-around'>
        <button onClick={() => setFilter('all')}>
          All
        </button>
        <button onClick={() => setFilter('income')}>
          Incomes
        </button>
        <button onClick={() => setFilter('expense')}>
          Expenses
        </button>
      </div>

      <table>
        <thead>
          <tr>
            {keysToDisplay.map((title) => (
              <th key={title}>
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {keysToDisplay.map((value, colIndex) => (
                <td key={colIndex}>
                  {row[value]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
