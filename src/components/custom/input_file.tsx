import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { FileIcon, Trash } from "lucide-react";
import Url from "@/config/url";
import Link from "next/link";
interface InputFileProps {
  name: string;
  value: File | File[] | string | string[] | null;
  onChange: (e: {
    target: { name: string; value: File | File[] | string | string[] | null };
  }) => void;
  label?: string;
  error?: string | null;
  multiple?: boolean;
  cols?: 1 | 2 | 3 | 4;
}

export default function InputFile({
  name,
  value,
  onChange,
  label,
  error,
  multiple = false,
  cols = 1,
}: InputFileProps) {
  const _cols = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  }[cols];
  const [files, setFiles] = useState<(File | string)[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    onDrop: (acceptedFiles) => {
      const newFiles = multiple
        ? [...files, ...acceptedFiles]
        : [acceptedFiles[0]];

      setFiles(newFiles);
      onChange({ target: { name, value: newFiles[0] || null } });
    },
  });

  useEffect(() => {
    if (Array.isArray(value)) {
      setFiles(value);
    } else if (value) {
      setFiles([value]);
    } else {
      setFiles([]);
    }
  }, [value]);

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange({ target: { name, value: updatedFiles[0] || null } });
  };

  return (
    <div className={`py-8 w-full grid ${_cols} gap-4 px-6 items-start`}>
      {/* {label && <label className="text-sm font-semibold mb-1 block">{label}</label>} */}

      {/* Conditionally render the drag-and-drop area or the file list */}
      {files.length === 0 ? (
        <div
          {...getRootProps({
            className:
              "border border-dashed border-gray-300 p-4 rounded cursor-pointer text-center hover:bg-gray-50",
          })}>
          <input {...getInputProps()} />
          <FileIcon className="w-24 h-24 mx-auto" />
          <p className="text-gray-600">
            Drag &apos;n&apos; drop files here, or click to select files
          </p>
          <p className="text-sm text-gray-500">Accepted: PDF, DOCX</p>
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 p-4 rounded text-center">
          <ul className="mt-4 space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 border rounded bg-gray-50">
                {typeof file === "string" ? (
                  <Link
                    href={`${Url.storage}${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm truncate max-w-[80%]">
                    <FileIcon className="w-24 h-24 mx-auto" />
                    <p>click to open file</p>
                  </Link>
                ) : (
                  <span className="text-sm truncate">{file.name}</span>
                )}
                <Button variant="destructive" onClick={() => removeFile(index)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
