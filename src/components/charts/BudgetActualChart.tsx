import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  month: string
  budget: number
  actual: number
}

interface BudgetActualChartProps {
  data: DataPoint[]
}

export default function BudgetActualChart({ data }: BudgetActualChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="budget"
            stroke="#8884d8"
            name="予算"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#82ca9d"
            name="実績"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 