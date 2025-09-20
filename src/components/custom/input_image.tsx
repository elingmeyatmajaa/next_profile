"use client";

import { useEffect, useState } from "react";
import Dropzone, { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import Image from "next/image";
import Url from "@/config/url";
import { IconPhoto, IconPhotoPlus, IconTrash } from "@tabler/icons-react";
import __ from "@/lib/lang";

interface InputImageProps {
  name: string;
  value: any[] | string | File | null | undefined;
  onChange: (e: any) => void;
  id?: string;
  label?: string;
  placeholder?: string;
  error?: string | null;
  multiple?: boolean;
  cols?: 1 | 2 | 3 | 4;
  required?: boolean;
}

export default function InputImage({
  name,
  required = false,
  value,
  onChange,
  label,
  error,
  multiple = false,
  cols = 1,
}: InputImageProps) {
  const _cols = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  }[cols];
  const { getRootProps } = useDropzone({ accept: { "image/*": [".png"] } });
  const [values, setValues] = useState([] as any);
  const renderHolder = () => {
    return (
      <div className="py-12 ">
        <IconPhoto className="w-14 h-14 mx-auto" />
        <p className="text-sm">
          Drag &apos;n&apos; drop or click to select files
        </p>
      </div>
    );
  };
  const renderValues = () => {
    return (
      <div className={`py-8 w-full grid ${_cols} gap-4 px-6 items-start`}>
        {values.map((file: any, index: number) => renderFile(file, index))}
        {multiple && (
          <div
            className="rounded border mb-3 relative px-2 py-2"
            key={"add-new"}>
            <IconPhotoPlus className="w-12 h-12 mx-auto " />
            <p className=" text-xs ">Add New Photo</p>
          </div>
        )}
      </div>
    );
  };

  const renderFile = (file: any, index: number) => {
    return (
      <div
        className="rounded relative"
        onClick={(e) => {
          e.stopPropagation();
        }}
        key={index.toString()}>
        {renderThumbnail(file)}
        <div className="absolute top-0 right-0">
          <Button
            variant="destructive"
            // className="rounded-full p- hover:text-red-600 "
            onClick={(e: any) => {
              e.stopPropagation();
              let newValues = values.filter((v: any, i: number) => i != index);
              setValues(newValues);
            }}>
            <IconTrash className="w-4 h-4 group-focus-within:text-red-600" />
          </Button>
        </div>
      </div>
    );
  };

  const renderThumbnail = (file: any) => {
    const renderFileName = () => {
      return (
        <p className="text-xs rounded-b p-2 text-ellipsis overflow-clip">
          {typeof file == "string" ? file : file.name}
        </p>
      );
    };
    if (typeof file == "string") {
      let src = "";
      if (file.includes("http")) {
        src = file;
      } else {
        src = Url.storage + file;
      }
      return (
        <>
          <Image
            width={200}
            height={200}
            alt=""
            src={src}
            className="h-56 object-cover rounded-t mx-auto"
          />
          {/* {renderFileName()} */}
        </>
      );
    }
    return (
      <>
        <img
          src={URL.createObjectURL(file)}
          className="h-56 object-cover rounded-t mx-auto"
        />
        {renderFileName()}
      </>
    );
  };

  // useEffect(() => {
  //     if (values.length == 0) return;
  //     if (multiple) {
  //         onChange({ target: { name: name, value: values } } as React.ChangeEvent<HTMLInputElement>)
  //     } else {
  //         onChange({ target: { name: name, value: values[0] ?? '' } } as React.ChangeEvent<HTMLInputElement>)
  //     }
  // }, [values])
  useEffect(() => {
    if (!value) {
      setValues([]);
      return;
    }
    if (typeof value == "string") {
      if (value != "") {
        setValues([value]);
      }
    } else if (value instanceof File) {
      setValues([value]);
    } else {
      setValues(value);
    }
  }, [value]);
  return (
    <div >
      <div className="w-full ">
        {label && (
          <div className="mb-1">
            <label className="text-sm font-semibold">
              {__(label)}
              {required && <span className="text-red-600">*</span>}
            </label>
          </div>
        )}
        <Dropzone
          {...getRootProps({ className: "dropzone" })}
          onDrop={(acceptedFiles) => {
            if (!multiple) {
              setValues(acceptedFiles);
              onChange({
                target: { name: name, value: acceptedFiles[0] ?? "" },
              });
            } else {
              setValues([...values, ...acceptedFiles]);
              onChange({ target: { name: name, value: acceptedFiles } });
            }
          }}
          onDropRejected={(rejectedFiles) => {}}
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif"] }}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="text-center border-2 border-gray-300 border-dashed rounded cursor-pointer">
                  {values.length == 0 ? renderHolder() : renderValues()}
                </div>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import Dropzone, { useDropzone } from "react-dropzone";
// import { Button } from "../ui/button";
// import Image from "next/image";
// import Url from "@/config/url";
// import __ from "@/lib/lang";
// import { FileIcon, PhoneOutgoing, Plus, Trash } from "lucide-react";

// interface InputImageProps {
//   name: string;
//   value: any[] | string | File | null | undefined;
//   onChange: (e: any) => void;
//   id?: string;
//   label?: string;
//   placeholder?: string;
//   error?: string | null;
//   multiple?: boolean;
//   cols?: 1 | 2 | 3 | 4;
//   required?: boolean;
// }

// export default function InputImage({
//   name,
//   value,
//   onChange,
//   label,
//   required = false,
//   error,
//   multiple = false,
//   cols = 1,
// }: InputImageProps) {
//   const _cols = {
//     1: "lg:grid-cols-1",
//     2: "lg:grid-cols-2",
//     3: "lg:grid-cols-3",
//     4: "lg:grid-cols-4",
//   }[cols];
//   const { getRootProps } = useDropzone({ accept: { "image/*": [".png"] } });
//   const [values, setValues] = useState([] as any);
//   const renderHolder = () => {
//     return (
//       <div className="py-12  ">
//         <FileIcon className="w-24 h-24 mx-auto" />
//         <p className="text-sm text-gray-500">
//           Drag &apos;n&apos; drop or click to select files
//         </p>
//         <p className="text-sm text-gray-500">Accepted: PNG, JPG, JPEG, GIF</p>
//       </div>
//     );
//   };
//   const renderValues = () => {
//     return (
//       <div className={`py-8 w-full grid ${_cols} gap-4 px-6 items-start`}>
//         {values.map((file: any, index: number) => renderFile(file, index))}
//         {multiple && (
//           <div
//             className="rounded border mb-3 relative px-2 py-2"
//             key={"add-new"}>
//             <Plus className="w-12 h-12 mx-auto " />
//             <p className=" text-xs ">Add New Photo</p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderFile = (file: any, index: number) => {
//     return (
//       <div
//         className="rounded border relative"
//         onClick={(e) => {
//           e.stopPropagation();
//         }}
//         key={index.toString()}>
//         {renderThumbnail(file)}
//         <div className="absolute top-0 right-0">
//           <Button
//             variant="destructive"
//             // className="rounded-full p- hover:text-red-600 "
//             onClick={(e: any) => {
//               e.stopPropagation();
//               let newValues = values.filter((v: any, i: number) => i != index);
//               setValues(newValues);
//             }}>
//             <Trash className="w-4 h-4 group-focus-within:text-red-600" />
//           </Button>
//         </div>
//       </div>
//     );
//   };

//   const renderThumbnail = (file: any) => {
//     const renderFileName = () => {
//       return (
//         <p className="text-xs rounded-b p-2 text-ellipsis overflow-clip">
//           {typeof file == "string" ? file : file.name}
//         </p>
//       );
//     };
//     if (typeof file == "string") {
//       let src = "";
//       if (file.includes("http")) {
//         src = file;
//       } else {
//         src = Url.storage + file;
//       }
//       return (
//         <>
//           <Image
//             width={200}
//             height={200}
//             alt=""
//             src={src}
//             className="h-56 object-cover rounded-t mx-auto"
//           />
//           {/* {renderFileName()} */}
//         </>
//       );
//     }
//     return (
//       <>
//         <img
//           src={URL.createObjectURL(file)}
//           className="h-56 object-cover rounded-t mx-auto"
//         />
//         {renderFileName()}
//       </>
//     );
//   };

//   // useEffect(() => {
//   //     if (values.length == 0) return;
//   //     if (multiple) {
//   //         onChange({ target: { name: name, value: values } } as React.ChangeEvent<HTMLInputElement>)
//   //     } else {
//   //         onChange({ target: { name: name, value: values[0] ?? '' } } as React.ChangeEvent<HTMLInputElement>)
//   //     }
//   // }, [values])
//   useEffect(() => {
//     if (!value) {
//       setValues([]);
//       return;
//     }
//     if (typeof value == "string") {
//       if (value != "") {
//         setValues([value]);
//       }
//     } else if (value instanceof File) {
//       setValues([value]);
//     } else {
//       setValues(value);
//     }
//   }, [value]);
//   return (
//     <div className="">
//       <div className="w-full ">
//         {label && (
//           <div className="mb-1">
//             <label className="text-sm font-semibold">
//               {__(label)}
//               {required && <span className="text-red-600">*</span>}
//             </label>
//           </div>
//         )}

//         <Dropzone
//           {...getRootProps({ className: "dropzone" })}
//           onDrop={(acceptedFiles) => {
//             if (!multiple) {
//               setValues(acceptedFiles);
//               onChange({
//                 target: { name: name, value: acceptedFiles[0] ?? "" },
//               });
//             } else {
//               setValues([...values, ...acceptedFiles]);
//               onChange({ target: { name: name, value: acceptedFiles } });
//             }
//           }}
//           onDropRejected={(rejectedFiles) => {}}
//           accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif"] }}>
//           {({ getRootProps, getInputProps }) => (
//             <section>
//               <div {...getRootProps()}>
//                 <input {...getInputProps()} />
//                 <div className="text-center  border rounded cursor-pointer">
//                   {values.length == 0 ? renderHolder() : renderValues()}
//                 </div>
//               </div>
//             </section>
//           )}
//         </Dropzone>
//       </div>
//       {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
//     </div>
//   );
// }
