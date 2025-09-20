'use client'

import dynamic from "next/dynamic";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import __ from "@/lib/lang";
import Link from "next/link";
import LineChart from "./apex-chart";
import ReactApexChart from "react-apexcharts";
import HttpClient from "@/lib/http_client";

interface DashboardCardProps {
    label: string;
    url: string;
    permission: string;
    link: string;
    icon?: any;
    apexChart?: any;

}

export default function DashboardCard({
    label,
    url,
    permission,
    link,
    icon,
    apexChart,


}: DashboardCardProps) {
    // const [data, setData] = useState(0);

    // const getData = async () => {
    //     const { data: total } = await HttpClient.GET(url);
    //     setData(total.data);
    // };

    // useEffect(() => {
    //     getData();
    // }, []);



    return (
        <>
            <Card className="bg-transparent w-full">
                <Link href={link}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex text-sm font-bold">
                            {__(label)}
                        </CardTitle>
                        {icon}
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-row items-center text-2xl font-bold">+ 0</div>
                    </CardContent>
                    {apexChart}
                </Link>
            </Card>
        </>
    );
}
