import React from 'react';

interface Column {
  key: string;
  name: string;
}

interface DataTableProps {
  data: Record<string, any>[];
  columns: Column[];
  maxRows?: number;
}

const DataTable: React.FC<DataTableProps> = ({ data, columns, maxRows = 10 }) => {
  const displayData = maxRows ? data.slice(0, maxRows) : data;
  const hasMoreRows = data.length > maxRows;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayData.length > 0 ? (
            displayData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.key}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                  >
                    {row[column.key] !== undefined ? String(row[column.key]) : '-'}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {hasMoreRows && (
        <div className="bg-gray-50 px-6 py-3 text-center text-sm text-gray-500 border-t border-gray-200">
          Showing {maxRows} of {data.length} rows
        </div>
      )}
    </div>
  );
};

export default DataTable;