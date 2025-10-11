import React, { type FC } from "react";

type ZigzagType = {
  items: React.ReactNode;
};

const Zigzag: FC<ZigzagType> = ({ items }) => {
  const width = 150;
  const height = 50;
  const path = `M0 ${height / 2} C ${width / 2} 0, ${
    width / 2
  } ${height}, ${width} ${height / 2}`;
  const endX = width;
  const endY = height / 2;
  return (
    <svg width={width + 20} height={height}>
      <path
        d={path}
        fill="none"
        stroke="#007bff"
        strokeWidth="2"
        strokeDasharray="6, 4"
      />
      <foreignObject x={endX - 10} y={endY - 10} width={20} height={20}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {items}
        </div>
      </foreignObject>
    </svg>
  );
};

export default Zigzag;
