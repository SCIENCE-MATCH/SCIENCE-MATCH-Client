import React from "react";
import { ResponsiveContainer, ComposedChart, Bar, XAxis, Line } from "recharts";

const data = [
  {
    name: "3주전",
    questions: 95,
    line: 80,
  },
  {
    name: "2주전",
    questions: 75,
    line: 60,
  },
  {
    name: "1주전",
    questions: 90,
    line: 75,
  },
  {
    name: "이번주",
    questions: 80,
    line: 65,
  },
];

const ResolvedQuestionGraph = () => {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <ComposedChart data={data} margin={{ right: 50 }}>
        <XAxis dataKey="name" tickMargin={10} style={{ fontSize: "15px", fontWeight: "500", lineHeight: "24.2px" }} />
        <Bar dataKey="questions" fill="#05f200" barSize={37} isAnimationActive={false} />
        <Line type="linear" dataKey="line" strokeWidth={4} stroke="#ef7e3e" fill="#ef7e3e" isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ResolvedQuestionGraph;
