import React, { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function PayrollGraph({ labels, dataset, mainLabel }) {
    return (<>
        <BarChart
            xAxis={[{ scaleType: "band", data: labels }]}
            series={[
                {
                    data: dataset,
                    label: mainLabel,
                },
            ]}
            height={300}
        />
    </>);
}