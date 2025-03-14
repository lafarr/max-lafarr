"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 1200,
  },
  {
    name: "Feb",
    total: 1900,
  },
  {
    name: "Mar",
    total: 1500,
  },
  {
    name: "Apr",
    total: 1700,
  },
  {
    name: "May",
    total: 2400,
  },
  {
    name: "Jun",
    total: 2100,
  },
  {
    name: "Jul",
    total: 1800,
  },
  {
    name: "Aug",
    total: 2300,
  },
  {
    name: "Sep",
    total: 2500,
  },
  {
    name: "Oct",
    total: 2200,
  },
  {
    name: "Nov",
    total: 2800,
  },
  {
    name: "Dec",
    total: 3200,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

