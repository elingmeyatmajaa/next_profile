import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import can from "@/utilities/can";
import React, { useEffect, useState } from "react";
import HttpUtility from "@/utilities/http_utility";
import __ from "@/lib/lang";
import Link from "next/link";

interface DashboardCardProps {
  label: string;
  url: string;
  permission: string;
  link: string;
  icon: any;
  // item: any;
}
export default function DashboardCard({
  label,
  // item,
  icon,
  url,
  permission,
  link,
}: DashboardCardProps) {
  const [data, setData] = useState(0);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    const { total } = await HttpUtility.get(url);
    setData(total);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {can(permission) && (
        <Card className="drop-shadow-xl rounded-xl hover:scale-95 transition duration-300 ease-in-out">
          <Link href={link}>
            <CardHeader className="flex border-b flex-row mb-5 items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-4xl font-bold text-sky-800">
                {data}
              </CardTitle>
              <div className="border-2 p-1 rounded-lg border-sky-800">
                <icon.name className="w-7 h-7 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-bold text-muted-foreground ">{__(label)}</p>
            </CardContent>
          </Link>
        </Card>
      )}
    </>
  );
}
