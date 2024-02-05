import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

const data = [
  {
    name: "3주전",
    questions: 95,
  },
  {
    name: "2주전",
    questions: 75,
  },
  {
    name: "1주전",
    questions: 90,
  },
  {
    name: "이번주",
    questions: 80,
  },
];

const ResolvedQuestionGraph = () => {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={data} margin={{ right: 50 }}>
        <XAxis dataKey="name" tickMargin={10} style={{ fontSize: "15px", fontWeight: "500", lineHeight: "24.2px" }} />
        <Tooltip />
        <Bar dataKey="questions" fill="#05f200" barSize={37} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResolvedQuestionGraph;
