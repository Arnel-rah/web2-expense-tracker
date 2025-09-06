
export default function List({ data }: {data : any[]}) {
const columnsToShow=['description','amount', 'date'];
const keysToDisplay = Object.keys(data[0]).filter((key)=>columnsToShow.includes(key));

  return (


    <table>
      <thead>
        <tr>
          {
            keysToDisplay.map((title) => (
              <th
                className="w-200"
                key={title}>{title}</th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {
          data.map((row, rowIndex) => (
            <tr key={rowIndex}>{
              keysToDisplay.map((value,colIndex) => (
                <td key={colIndex}>{row[value]}</td>
              ))
            }

            </tr>
          ))
        }
      </tbody>
    </table>

  )
}