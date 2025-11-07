"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ConfidenceChartProps {
  real_confidence: number
  fake_confidence: number
}

export default function ConfidenceChart({ real_confidence, fake_confidence }: ConfidenceChartProps) {
  const data = [
    {
      name: "Real",
      confidence: Math.round(real_confidence),
      fill: "#10b981",
    },
    {
      name: "Fake",
      confidence: Math.round(fake_confidence),
      fill: "#ef4444",
    },
  ]

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" domain={[0, 100]} />
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "8px",
              color: "#ffffff",
            }}
          />
          <Bar dataKey="confidence" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Bar key={index} dataKey="confidence" fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
