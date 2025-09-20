// components/CardComponent.tsx
"use client";
import { Card } from "@/components/ui/card";
import React from "react";

interface CardProps {
  label1: string;
  label2: string;
  icon: any;
  height: any;
  text1: any;
  text2: any;
  background: any;
}

const CardComponent: React.FC<CardProps> = ({
  label1,
  label2,
  icon,
  height,
  text1,
  text2,
  background,
}) => {
  return (
    <Card className={`bg-transparent w-full flex items-center ${height} px-3`}>
      <div
        className={`border-none h-12 w-12 rounded-md mr-5 flex justify-center items-center ${background}`}>
        {icon}
      </div>
      <div className="row">
        <div className="font-weight-medium">
          {label1} {text1}
        </div>
        <div className="text-xs ">
          {label2} {text2}
        </div>
      </div>
    </Card>
  );
};

export default CardComponent;
