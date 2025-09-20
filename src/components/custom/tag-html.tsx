"use client";
import React, { useState } from "react";

interface ComponentProps {
  htmlContent: any;
  className?: any;
}

const TagHtml: React.FC<ComponentProps> = ({ htmlContent, className }) => {
  return (
    <>
      <div
        className={`${className} article`}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </>
  );
};

export default TagHtml;
