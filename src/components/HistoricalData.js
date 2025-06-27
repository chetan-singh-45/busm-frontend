export default function HistoricalData() {
  const data = [
    {
      date: 'Jun 26, 2025',
      price: 42982.43,
      open: 43130.33,
      high: 43130.33,
      low: 42871.5,
      volume: '527.47M',
      change: -0.25,
    },
    {
      date: 'Jun 24, 2025',
      price: 43089.02,
      open: 42807.13,
      high: 43183.48,
      low: 42794.08,
      volume: '516.07M',
      change: 1.19,
    },
    {
      date: 'Jun 23, 2025',
      price: 42581.78,
      open: 42178.55,
      high: 42609.47,
      low: 41981.14,
      volume: '503.06M',
      change: 0.89,
    },
    {
      date: 'Jun 20, 2025',
      price: 42206.82,
      open: 42291.09,
      high: 42432.19,
      low: 42089.99,
      volume: '859.85M',
      change: 0.08,
    },
  ];

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm text-left text-gray-600 border">
        <thead className="text-xs uppercase bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Open</th>
            <th className="px-4 py-2">High</th>
            <th className="px-4 py-2">Low</th>
            <th className="px-4 py-2">Volume</th>
            <th className="px-4 py-2">% Change</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{row.date}</td>
              <td className={`px-4 py-2 ${row.change < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {row.price.toLocaleString()}
              </td>
              <td className="px-4 py-2">{row.open.toLocaleString()}</td>
              <td className="px-4 py-2">{row.high.toLocaleString()}</td>
              <td className="px-4 py-2">{row.low.toLocaleString()}</td>
              <td className="px-4 py-2">{row.volume}</td>
              <td className={`px-4 py-2 ${row.change < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {row.change > 0 ? `+${row.change}%` : `${row.change}%`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
