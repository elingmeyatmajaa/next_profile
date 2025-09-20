"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus, Search, Loader, Trash2 } from "lucide-react";
import __ from "@/lib/lang";
import { Button } from "./button";

import { useToast } from "@/components/ui/use-toast";
import DialogComponent from "@/components/custom/dialog-component";
import TextForm from "@/components/custom/text_form";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { UeException } from "@/exceptions/ue_exception";
import { de } from "date-fns/locale";
import FormContainer from "@/app/admin/components/form-container";
import HttpClient from "@/lib/http_client";
import InputMoney from "./input_money";
import { IconCashBanknote } from "@tabler/icons-react";

type ColumnDataListType = {
  label: string;
  value: string;
  renderLabel?: (data: any) => any;
};
type DataListType = {
  label: string;
  fieldName: string;
  dataType: string;
  formType: string;
  urlSelectSearch?: string;
  column?: ColumnDataListType;
  detailedDataName?: string;
  // refreshers?: [];
};

type FormDataType = {
  data: DataListType[];
  title: string;
  width: string;
  url: string;
};
interface FormProps {
  editableForm: EditableFormType;
  afterSave: () => void;
  onClose: () => void;
  isDetail?: boolean;
  formData: FormDataType[] | undefined;
}

function ModalAddData({
  editableForm,
  afterSave,
  isDetail,
  formData,
  onClose,
}: FormProps) {
  const [data, setData] = useState<Record<string, any>>({});
  const [actions, setActions] = useState([] as any[]);
  const selectDataType = (type: string) => {
    switch (type) {
      case "string":
        return "";
        break;
      case "number":
        return 0;
        break;
      default:
        return "";
    }
  };

  // const selectFormTypeProps = (type: string) => {
  //   switch (type) {
  //     case "text":
  //       return {
  //         label: "",
  //         placeholder: "",
  //         required: true,
  //       };
  //       break;
  //     case "select":
  //       return {
  //         label: "",
  //         url: "",
  //         required: true,
  //         addData: false,
  //         formData: [],
  //       };
  //       break;
  //     default:
  //       return {
  //         label: "",
  //         placeholder: "",
  //         required: true,
  //       };
  //   }
  // };

  useEffect(() => {
    setData(() => {
      const newData: Record<string, any> = {};
      formData?.[0]?.data.forEach((item: DataListType) => {
        if (item.formType === "InputSearch") {
          if (item.detailedDataName) {
            newData[item.detailedDataName] = {
              uuid: "",
              name: "",
            };
          }

          newData[item.fieldName] = selectDataType(item.dataType);
        } else {
          newData[item.fieldName] = selectDataType(item.dataType);
        }
      });
      return newData;
    });
    setErrors({});
  }, []);

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({} as any);
  async function handleSave() {
    try {
      setLoading(true);
      console.log("data", { ...data });
      await HttpClient.POSTFILE(formData?.[0]?.url ?? "", { ...data });
      setLoading(false);
      toast({
        title: __("Add Data"),
        description: __("Data updated successfully"),
      });

      onClose();
      afterSave();
    } catch (error) {
      if (error instanceof UeException) {
        setErrors(error.errors);
      }
      setLoading(false);
    }
  }

  const renderConfirmText = () => {
    if (loading) {
      return (
        <p className="flex items-center">
          <Loader className="ml-3 mr-1 h-5 w-5 animate-spin " />{" "}
          <p className="mr-3">Loading...</p>
        </p>
      );
    } else {
      return __("Save");
    }
  };

  const renderTitle = () => {
    return formData?.[0]?.title ?? __("Add New Data");
  };

  const selectFormType = (
    fieldName: string,
    label: string,
    formType: string,
    urlSelectSearch?: string,
    column?: ColumnDataListType,
    detailedDataName?: string
  ) => {
    switch (formType) {
      case "InputMoney":
        return (
          <InputMoney
            label={label}
            icon={<IconCashBanknote />}
            name={fieldName}
            value={data[fieldName]}
            onChange={(e) => {
              setData((prevData: any) => ({
                ...prevData,
                [fieldName]: e.target.value,
              }));
            }}
            error={errors[fieldName]}
          />
        );
        break;
      case "TextForm":
        return (
          <TextForm
            label={label}
            placeholder={""}
            value={data[fieldName]}
            onChange={(e: any) => {
              setData((prevData: any) => ({
                ...prevData,
                [fieldName]: e.target.value,
              }));
            }}
            error={errors[fieldName]}
            required={true}
            showErrorMessages={true}
          />
        );
        break;
      case "InputSearch":
        return (
          <InputSearch
            label={label}
            column={{
              label: column?.label ?? "",
              value: column?.value ?? "",
            }}
            url={urlSelectSearch ?? ""}
            required={true}
            error={errors[fieldName]}
            value={{
              [column?.label ?? ""]: data?.[detailedDataName ?? ""]?.name,
              [column?.value ?? ""]: data?.[detailedDataName ?? ""]?.uuid,
            }}
            onChange={(value: any) => {
              setData((prevData: any) => ({
                ...prevData,
                [fieldName]: value.uuid,
                [detailedDataName ?? ""]: {
                  uuid: value?.uuid,
                  name: value?.name,
                },
              }));
            }}
            refreshers={[]}
          />
        );
        break;
      default:
        return (
          <TextForm
            label={label}
            placeholder={""}
            value={data[fieldName]}
            onChange={(value: any) => {
              setData((prevData: any) => ({
                ...prevData,
                [fieldName]: value,
              }));
            }}
            error={errors[fieldName]}
            required={true}
            showErrorMessages={true}
          />
        );
    }
  };

  return (
    <DialogComponent
      open={editableForm.show}
      title={renderTitle()}
      width={formData?.[0]?.width ?? "w-[30%]"}
      cancelText={editableForm.isDetail ? __("Close") : __("Cancel")}
      onConfirm={() => handleSave()}
      confirmText={renderConfirmText()}
      setOpen={() => onClose()}>
      <FormContainer>
        {formData?.[0]?.data.map((item: DataListType, index: number) => {
          return (
            <div key={index} className="mb-4">
              {selectFormType(
                item.fieldName,
                item.label,
                item.formType,
                item.urlSelectSearch,
                item.column,
                item.detailedDataName
              )}
            </div>
          );
        })}
      </FormContainer>
    </DialogComponent>
  );
}

type InputSearch = {
  label?: string;

  column: {
    label?: any;
    value: any;
    renderLabel?: (data: any) => any;
  };
  value: any;
  error?: string | null;
  onChange: (value: any) => void;
  id?: string;
  url: string;
  addData?: boolean;
  formData?: FormDataType[];
  required?: boolean;
  showErrorMessages?: boolean;
  refreshers?: any;
};

export default function InputSearch({
  url,
  required,
  id,
  addData = false,
  formData,
  column,
  label,
  error,
  showErrorMessages = true,
  value,
  onChange,
  refreshers,
}: InputSearch) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(value);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedItem(value);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response;
        if (url.indexOf("?") > -1) {
          response = await fetch(`/api/${url}&search=${searchTerm}`);
        } else {
          response = await fetch(`/api/${url}search=${searchTerm}`);
        }
        const data = await response.json();
        setData(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, refreshers]);

  useEffect(() => {
    onChange(selectedItem);
  }, [selectedItem]);

  const [editableForm, setEditTableForm] = useState({
    data: {},
    show: false,
    isDetail: false,
  } as EditableFormType);

  function handleAddNewItem() {
    setEditTableForm({
      data: {},
      show: true,
      isDetail: false,
    });
  }

  const [isReload, setIsReload] = useState(false);
  return (
    <div className="relative " ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="text-sm mb-2 font-semibold">
          <div className="">
            {__(label)}
            {required && <span className="text-red-600">*</span>}
          </div>
        </label>
      )}
      <div className="flex items-center">
        <button
          className={`flex items-center justify-between w-full px-3 py-2.5 text-sm mt-1 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            error ? "border-red-500" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}>
          <span className="block truncate text-black">
            {selectedItem ? `${selectedItem[column.label]}` : "Select item..."}
          </span>
          <ChevronDown
            className={`w-4 h-4 ml-2  ${error ? "text-red-700" : ""}`}
          />
        </button>
        {addData && (
          <button
            onClick={() => handleAddNewItem()}
            className="flex items-center justify-center ml-2 h-9 w-9 mt-1 bg-sky-900 text-white transition-all duration-200 hover:bg-gray-700 rounded-md active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Increase quantity">
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-[1000] w-full mt-2 border bg-white rounded-md shadow-lg">
          <div className="flex items-center px-3 py-2 border-b">
            <Search className="w-4 h-4 mr-2 opacity-50" />
            <input
              type="text"
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          <ul className="py-1 overflow-auto text-sm max-h-60" role="listbox">
            {isLoading ? (
              <li className="px-3 py-2 text-gray-500">Loading...</li>
            ) : data?.length === 0 ? (
              <li className="px-3 py-2 text-gray-500">No item found.</li>
            ) : (
              data?.map((item: any) => (
                <li
                  key={item[column.value]}
                  onClick={() => {
                    setSelectedItem(item);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`px-3 py-2 flex items-center cursor-pointer ${
                    selectedItem?.[column.value] === item[column.value]
                      ? "bg-blue-100 text-blue-900"
                      : "hover:bg-gray-100"
                  }`}
                  role="option"
                  aria-selected={
                    selectedItem?.[column.value] === item[column.value]
                  }>
                  <span className="flex-grow">
                    {item[column.label] ?? column.renderLabel!(item)}
                  </span>
                  {/* {selectedItem?.[column.value] === item[column.value] && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )} */}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      {error && showErrorMessages && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}

      <ModalAddData
        editableForm={editableForm}
        formData={formData}
        afterSave={() => {
          setIsReload(!isReload);
          setEditTableForm({
            ...editableForm,
            show: false,
          });
        }}
        onClose={() =>
          setEditTableForm({
            ...editableForm,
            show: false,
          })
        }
      />
    </div>
  );
}
