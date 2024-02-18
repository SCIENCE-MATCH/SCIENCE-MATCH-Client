import React from "react";
import { Bar, XAxis, YAxis, ResponsiveContainer, BarChart, LabelList } from "recharts";

const data = [
  {
    name: "상",
    percentage: 50,
    label: "50%",
  },
  {
    name: "중상",
    percentage: 70,
    label: "70%",
  },
  {
    name: "중",
    percentage: 95,
    label: "95%",
  },
  {
    name: "중하",
    percentage: 90,
    label: "90%",
  },
  {
    name: "하",
    percentage: 100,
    label: "100%",
  },
];

const HorizontalBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={258}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{
          left: 33,
          right: 180,
        }}
      >
        <XAxis type="number" tickCount={0} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={17}
          style={{ fontSize: "24px", fontWeight: "800", lineHeight: "29.05px" }}
        />
        <Bar dataKey="percentage" barSize={25} fill="#d9d9d9" isAnimationActive={false}>
          <LabelList
            dataKey="label"
            position="center"
            style={{ fontSize: "20px", fontWeight: "400", lineHeight: "24.2px" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
export default HorizontalBarChart;
