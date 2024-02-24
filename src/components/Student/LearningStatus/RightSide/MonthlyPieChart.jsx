import React from "react";
import { PieChart, Pie, ResponsiveContainer, LabelList } from "recharts";

const data_1 = [{ name: "종합성취도", value: 95 }];
const data_2 = [{ name: "활동 영역", value: 100 }];
const data_3 = [{ name: "내용 영역", value: 98 }];

const MonthlyPieChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data_1}
          cx="20%"
          cy="50%"
          innerRadius={20}
          outerRadius={30}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
          isAnimationActive={false}
        >
          <LabelList
            dataKey="name"
            position="bottom"
            style={{ fontSize: "20px", fontWeight: "500", lineHeight: "24.2px" }}
          />
        </Pie>

        <Pie
          data={data_2}
          cx="50%"
          innerRadius={20}
          outerRadius={30}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
          isAnimationActive={false}
        >
          <LabelList
            dataKey="name"
            position="bottom"
            style={{ fontSize: "20px", fontWeight: "500", lineHeight: "24.2px" }}
          />
        </Pie>

        <Pie
          data={data_3}
          cx="80%"
          innerRadius={20}
          outerRadius={30}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
          isAnimationActive={false}
        >
          <LabelList
            dataKey="name"
            position="bottom"
            style={{ fontSize: "20px", fontWeight: "500", lineHeight: "24.2px" }}
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MonthlyPieChart;
