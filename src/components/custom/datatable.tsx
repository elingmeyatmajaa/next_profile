"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import HttpClient from "@/lib/http_client";
import { debounce, xor } from "lodash";

import DropdownComponent from "./dropdown-component";
import { SelectComponent } from "./select-component";
import __ from "@/lib/lang";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import {
  Archive,
  ArchiveRestore,
  ChevronDown,
  ChevronsUpDown,
  EllipsisVertical,
  Eye,
  Pencil,
  Plus,
  Trash,
  Upload,
} from "lucide-react";
import { IconCaretDownFilled, IconCaretRightFilled } from "@tabler/icons-react";
import { se } from "date-fns/locale";

type DatatableColumn = {
  name: string;
  label: string;
  render?: (e: any) => React.ReactNode;
  className?: string;
  searchable: boolean;
  sortable?: boolean;
  searchType?: string;
  searchKey: string;
  searchOptions?: { label: string; value: any }[];
  searchRemoteUrl?: string;
};

type TitleType = {
  name: string;
  current: boolean;
  link: string;
};

type OtherActioType = {
  title: string;
  permission: boolean;
  onClick: (e?: any) => void;
  icon?: React.ReactNode;
  colorButton?: string; // contoh: sky-500, red-500, lime-500, yellow-500 etc.
};

type DatatableType = {
  url: string;
  rowTree?: boolean;
  columns: DatatableColumn[];
  canCreate: boolean;
  canUpdate: boolean;
  top?: React.ReactNode;
  canDelete: boolean;
  canDeletePermanent: boolean;
  canExport: boolean;
  check?: boolean;
  canShow: boolean;
  handleCreate: () => void;
  handleUpdate: (e: any) => void;
  handleDetail: (e: any, isDetail: boolean) => void;
  handlePermanentDelete: (e: any[] | string) => void;
  handleDelete: (e: any[] | string) => void;
  handleRestore: (e: any[] | string) => void;
  handleExport?: (e: any) => void;
  title: TitleType[];
  reload: boolean;
  formatExport?: any[];
  otherActionTableBody?: OtherActioType[];
  useUuid?: boolean;

  otherActionTableHead?: OtherActioType[];
};

export default function DataTable({
  url,
  columns,
  canCreate,
  canDeletePermanent,
  canExport,
  otherActionTableBody = [],
  otherActionTableHead = [],
  canUpdate,
  canDelete,
  check,
  rowTree = false,
  useUuid = true,
  canShow,
  reload,
  handleCreate,
  handleDelete,
  handleUpdate,
  handleDetail,
  handlePermanentDelete,
  handleRestore,
  handleExport,
  formatExport,
  title,
  top,
}: DatatableType) {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<{
    search: string;
    sort_column: string;
    sort_direction: string;
    trashed: number | null;
    limit: number;
    page: number;
    [key: string]: any;
  }>({
    search: "",
    sort_column: "",
    sort_direction: "asc",
    trashed: null,
    limit: 20,
    page: 1,
  });

  const [data, setData] = useState({
    data: [] as any[],
    links: [],
    total: 0 as number,
  });
  type SearchableData = { name: string; data: any[] };
  const [searchableData, setSearchableData] = useState([] as SearchableData[]);

  useEffect(() => {
    async function fetchData(url: string = "", setter: (data: any) => void) {
      setLoading(true);
      const { data } = await HttpClient.GET(url, params);
      setter(data);
      setLoading(false);
    }
    fetchData(url, setData);

    // membuat params dengan key baru berdasarkan searchRemoteUrl
    columns.map((column) => {
      setParams((prevData: any) => {
        if (column.searchKey) {
          return {
            ...prevData,
            [column.searchKey]: [],
          };
        }
        return prevData;
      });
    });
  }, []);

  useEffect(() => {
    async function fetchSearchData(
      url: string = "",
      setter: (data: any) => void,
      key: string = ""
    ) {
      setLoading(true);
      const { data } = await HttpClient.GET(`/${url}`, params);
      setter((prevData: any) => {
        const findDuplicateData = prevData.find(
          (item: any) => item?.name === key
        );
        if (!findDuplicateData) {
          return [...prevData, { name: key, data: data.data }];
        }
        return prevData;
      });
      setLoading(false);
    }
    columns.map((column) => {
      if (column.searchRemoteUrl) {
        fetchSearchData(
          column.searchRemoteUrl,
          setSearchableData,
          column.searchKey
        );
      }
    });
  }, []);

  const handleReload = useCallback(
    debounce((params: any) => {
      setLoading(true);

      function splitArray() {
        return columns.map((column) => {
          setParams((prevData: any) => {
            if (column.searchKey) {
              return {
                ...prevData,
                [column.searchKey]: prevData[column.searchKey].map(
                  (i: string) => {
                    uuid: i;
                  }
                ),
              };
            }
            return prevData;
          });
        });
      }

      HttpClient.GET(url, params).then(({ data }) => {
        setData(data);
        setLoading(false);
      });

      setChecked([]);
    }, 500),
    []
  );

  useEffect(() => handleReload(params), [params, reload]);

  function paginationLabel(label: string, isActive: boolean) {
    if (label === "&laquo; Previous")
      return (
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
      );
    else if (label === "Next &raquo;")
      return (
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      );
    else if (label === "...")
      return (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      );
    else
      return (
        <PaginationItem>
          <PaginationLink
            className="cursor-pointer"
            onClick={() => {
              setParams({ ...params, page: Number(label) });
            }}
            isActive={isActive}>
            {label}
          </PaginationLink>
        </PaginationItem>
      );
  }

  const [checked, setChecked] = useState([] as any[]);
  const [isCheckAll, setIsCheckAll] = useState(true);

  const checkAll = () => {
    if (isCheckAll) {
      const newChecked: any[] = [];
      data.data.map((item: any) => {
        useUuid ? newChecked.push(item.uuid) : newChecked.push(item.id);
        // newChecked.push(item.uuid);
      });
      setChecked(newChecked);
    } else {
      setChecked([]);
    }
  };

  const zebraColour = (index: number) => {
    return index % 2 === 0 ? "bg-gray-50" : "bg-white";
  };

  const renderSearchable = () => {
    return columns.map((column: DatatableColumn, index: number) => {
      if (column.searchRemoteUrl) {
        //filter data by category
        const data = searchableData.find(
          (i: any) => i.name === column.searchKey
        );

        if (data) {
          return (
            <div key={index} className="mr-3">
              <div className="ml-2">
                <DropdownComponent
                  button={
                    <Button variant="ghost" className=" border">
                      <span className="sr-only">Open menu</span>
                      <span
                        className={`${
                          params[column?.searchKey].length > 0
                            ? "text-sky-600"
                            : "text-black"
                        } mr-2 font-semibold`}>
                        {column.label}
                      </span>
                      {params[column?.searchKey].length > 0 && (
                        <span className="mr-4 px-2 py-0.5 text-xs rounded-full text-white bg-sky-600">
                          + {params[column?.searchKey].length}
                        </span>
                      )}

                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  }
                  align="start"
                  // title="Name"
                >
                  {data?.data.map((item: any, index: number) => (
                    <DropdownMenuItem
                      key={index}
                      className="mb-1"
                      onClick={() => {}}>
                      <div
                        key={item.uuid}
                        className=" flex justify-center items-center gap-x-2">
                        <Checkbox
                          className="border-2 "
                          id={`${item.name}-${item.uuid}`}
                          checked={params[column?.searchKey].includes(
                            item.uuid
                          )}
                          onCheckedChange={(e: any) => {
                            setParams({
                              ...params,
                              [column.searchKey as string]: xor(
                                params[column?.searchKey],
                                [item.uuid]
                              ),
                            });
                          }}
                        />
                        <label
                          htmlFor={`${item.name}-${item.uuid}`}
                          className="text-sm ml-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                          {item.name}
                        </label>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownComponent>
              </div>
            </div>
          );
        }
      }
    });
  };

  const [activeMenu, setActiveMenu] = useState(title);

  const handleActiveMenu = (index: number) => {
    const newActiveMenu = [...activeMenu];
    newActiveMenu.map((item, key) => {
      if (index === key) {
        item.current = true;
      } else {
        item.current = false;
      }
    });
    setActiveMenu(newActiveMenu);
  };

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (index: string) => {
    setExpandedItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  interface FlattenedAccount extends Account {
    isExpanded?: boolean;
    parentUuid?: string;
    isVisible?: boolean;
    [key: string]: any; // Add this line
  }

  interface Account {
    uuid: string;
    name: string;
    children?: Account[];
    level: number;
  }

  function RowTree({ rows }: { rows: Account[] }) {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Flatten the tree structure and track visibility
    const flattenedAccounts = useMemo(() => {
      const flattened: FlattenedAccount[] = [];

      const flatten = (rows: any[], parentUuid?: string, level = 0) => {
        rows.forEach((account) => {
          const isExpanded = expandedItems.includes(account.uuid);
          flattened.push({
            ...account,
            level,
            isExpanded,
            parentUuid,
            isVisible: !parentUuid || expandedItems.includes(parentUuid),
          });

          if (account.children && account.children.length > 0) {
            flatten(account.children, account.uuid, level + 1);
          }
        });
      };

      flatten(rows);
      return flattened;
    }, [rows, expandedItems]);

    const toggleItem = useCallback((uuid: string) => {
      setExpandedItems((prev) =>
        prev.includes(uuid)
          ? prev.filter((item) => item !== uuid)
          : [...prev, uuid]
      );
    }, []);

    const toggleSelection = useCallback((uuid: string) => {
      setChecked((prev) =>
        prev.includes(uuid)
          ? prev.filter((item) => item !== uuid)
          : [...prev, uuid]
      );
    }, []);

    const visibleAccounts = flattenedAccounts.filter((account) => {
      if (!account.parentUuid) return true;

      let currentParent = account.parentUuid;
      while (currentParent) {
        if (!expandedItems.includes(currentParent)) return false;
        currentParent =
          flattenedAccounts.find((a) => a.uuid === currentParent)?.parentUuid ||
          "";
        currentParent =
          flattenedAccounts.find((a) => a.uuid === currentParent)?.parentUuid ||
          "";
      }
      return true;
    });

    return (
      <TableBody>
        {visibleAccounts.map((row) => {
          const hasChildren = row.children && row.children.length > 0;
          const isSelected = checked.includes(useUuid ? row.uuid : row.id);

          return (
            <TableRow key={useUuid ? row.uuid : row.id}>
              <TableCell>
                <div
                  className="flex items-center gap-2 hover:cursor-pointer"
                  style={{ paddingLeft: `${row.level * 20}px` }}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() =>
                      toggleSelection(useUuid ? row.uuid : row.id)
                    }
                  />

                  {/* <div className="border w-full border-sky-600"></div> */}

                  {hasChildren ? (
                    <button
                      className="p-1"
                      onClick={() => toggleItem(useUuid ? row.uuid : row.id)}>
                      {expandedItems.includes(useUuid ? row.uuid : row.id) ? (
                        <IconCaretDownFilled className="h-4 w-4 text-red-500" />
                      ) : (
                        <IconCaretRightFilled className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  ) : (
                    <div className="w-6" />
                  )}
                </div>
              </TableCell>

              {columns.map((column: DatatableColumn) => (
                <TableCell key={column.name}>
                  <p className="">
                    {column.render ? column.render(row) : row[column.name]}
                  </p>
                </TableCell>
              ))}
              <TableCell className="flex justify-end items-center">
                {/* non achieved */}
                {params.trashed == null && (
                  <DropdownComponent
                    button={
                      <EllipsisVertical className="hover:cursor-pointer" />
                    }
                    align="end">
                    {canShow && (
                      <DropdownMenuItem
                        className="flex hover:cursor-pointer mb-1 items-center  "
                        onSelect={(e) => {
                          setTimeout(() => {
                            handleDetail(row, true);
                          }, 1);
                        }}>
                        <Eye size={1.5} />

                        <p className="ml-1 text-sm">{__("Detail")}</p>
                      </DropdownMenuItem>
                    )}

                    {canUpdate && (
                      <DropdownMenuItem
                        className="flex hover:cursor-pointer mb-1 items-center  "
                        onClick={() => {
                          setTimeout(() => {
                            handleUpdate(row);
                          }, 1);
                        }}>
                        <Pencil size={1.5} />
                        <p className="ml-1 text-sm">{__("Edit")}</p>
                      </DropdownMenuItem>
                    )}

                    {checked.length < 1 && canDelete && (
                      <DropdownMenuItem
                        className="flex hover:cursor-pointer mb-1 items-center  "
                        onClick={() => {
                          setTimeout(() => {
                            handleDelete(useUuid ? row.uuid : row.id);
                          }, 1);
                        }}>
                        <Trash size={1.5} />
                        <p className="ml-1 text-sm">{__("Delete")}</p>
                      </DropdownMenuItem>
                    )}

                    {otherActionTableBody.length > 0 &&
                      otherActionTableBody?.map(
                        (item: OtherActioType, index: number) =>
                          item.permission && (
                            <DropdownMenuItem
                              key={item.title}
                              className="flex hover:cursor-pointer mb-1 items-center  "
                              onSelect={(e) => {
                                setTimeout(() => {
                                  item.onClick(row);
                                }, 1);
                              }}>
                              <Eye size={1.5} />

                              <p className="ml-1 text-sm">{item.title}</p>
                            </DropdownMenuItem>
                          )
                      )}
                  </DropdownComponent>
                )}

                {/* achieved */}
                {params.trashed != null && checked.length < 1 && (
                  <DropdownComponent
                    button={
                      <EllipsisVertical className="hover:cursor-pointer" />
                    }
                    align="end">
                    <DropdownMenuItem
                      className="flex hover:cursor-pointer mb-1 items-center  "
                      onClick={() => {
                        setTimeout(() => {
                          handleRestore(useUuid ? row.uuid : row.id);
                        }, 1);
                      }}>
                      <ArchiveRestore className="text-lime-600" />
                      <p className="ml-1 text-lime-600 font-semibold">
                        {__("Restore Data")}
                      </p>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="flex hover:cursor-pointer mb-1 items-center  "
                      onClick={() => {
                        setTimeout(() => {
                          handlePermanentDelete(useUuid ? row.uuid : row.id);
                        }, 1);
                      }}>
                      <Trash className="text-red-600" />
                      <p className="ml-1 text-red-600 font-semibold">
                        {__("Delete Permanent")}
                      </p>
                    </DropdownMenuItem>
                  </DropdownComponent>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  }

  return (
    <>
      <div>{top}</div>

      <div className="flex justify-between items-center py-4">
        <div className="flex">
          {title.map((item, index) => (
            <Link
              href={`/admin/${item.link}`}
              onClick={() => handleActiveMenu(index)}
              key={index}
              className={`${item.current ?? "border-emerald-500 border-b-2"} ${
                title.length > 1 ? "hover:bg-gray-100 hover:cursor-pointer" : ""
              } flex items-center mr-5  pr-5 pl-2 pt-3 pb-2 rounded-t-lg`}>
              <p
                className={`${
                  title.length > 1 ? "text-xl" : "text-2xl"
                } font-semibold mr-1`}>
                {__(`${item.name}`)}{" "}
                {params.trashed != null ? (
                  <span className=" mr-1 font-normal text-base">Archive</span>
                ) : (
                  ""
                )}
              </p>

              <p className="text-xs py-0.5 px-1.5 rounded font-semibold bg-gray-200">
                {data.total}
              </p>
            </Link>
          ))}
        </div>
        <div className="flex">
          <SelectComponent
            value={params.limit}
            onChange={(e) => setParams({ ...params, limit: Number(e) })}
            title="Select Limit Data"
            data={[
              { label: "5 data", value: 5 },
              { label: "10 data", value: 10 },
              { label: "20 data", value: 20 },
              { label: "50 data", value: 50 },
              { label: "100 data", value: 100 },
            ]}
          />

          {checked.length > 0 && params.trashed == null && canDelete && (
            <Button
              className=" text-white px-2 border bg-red-600 hover:bg-red-500 hover:text-white flex items-center justify-between ml-3"
              onClick={() => handleDelete(checked)}>
              <Trash size={1.5} />
              <span className="ml-1 font-medium">{__("Delete")}</span>{" "}
            </Button>
          )}
          {checked.length > 0 && params.trashed != null && (
            <Button
              className=" bg-white border border-red-500 text-red-600 px-2 hover:bg-red-500 hover:text-white flex items-center justify-between ml-3"
              onClick={() => handlePermanentDelete(checked)}>
              <Trash />
              <span className="ml-1 font-medium">
                {__("Delete Permanent")}
              </span>{" "}
            </Button>
          )}
          {checked.length > 0 && params.trashed != null && (
            <Button
              className=" bg-white border border-lime-500 text-lime-600 px-2 hover:bg-lime-500 hover:text-white flex items-center justify-between ml-3"
              onClick={() => handleRestore(checked)}>
              <ArchiveRestore />
              <span className="ml-1 font-semibold">
                {__("Restore Data")}
              </span>{" "}
            </Button>
          )}

          {canCreate && params.trashed == null && (
            <Button
              className="ml-3 px-2 bg-white border border-sky-600 hover:bg-sky-500 hover:text-white text-sky-600 "
              onClick={() => handleCreate()}>
              <Plus />
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md bg-yellow border ">
        <div className="flex justify-between my-3">
          <div className="flex items-center ml-3  ">
            {columns.find((column) => column.searchRemoteUrl) && (
              <div className="flex items-center">
                <p className="font-semibold mr-3">Filters : </p>
              </div>
            )}
            {renderSearchable()}
            <div className="">
              <Input
                type="search"
                placeholder="Cari..."
                value={params.search}
                onChange={(e) =>
                  setParams({ ...params, search: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex">
            {canExport && (
              <Button className=" bg-white text-emerald-500 hover:border-emerald-500  hover:bg-emerald-500 hover:text-white flex items-center justify-between mr-3">
                <span className="mr-1 font-semibold ">Export</span>
                <Upload />
              </Button>
            )}
            {otherActionTableHead.length > 0 &&
              otherActionTableHead?.map(
                (item: OtherActioType, index: number) =>
                  item.permission && (
                    <Button
                      key={item.title}
                      className={`bg-white text-${item.colorButton} hover:border-${item.colorButton}  hover:bg-${item.colorButton} hover:text-white flex items-center justify-between mr-3`}
                      onClick={() => item.onClick()}>
                      <span className="mr-1 font-semibold ">{item.title}</span>
                      {item.icon}
                    </Button>
                  )
              )}

            {canDelete && canDeletePermanent && (
              <Button
                className={`${
                  !params.trashed ? "bg-white" : "bg-gray-500 "
                } text-gray-500 hover:bg-gray-500 hover:text-white  flex items-center justify-between mr-3 `}
                onClick={() => {
                  if (params.trashed == null) {
                    setParams({ ...params, trashed: 1 });
                    setChecked([]);
                  } else {
                    setParams({ ...params, trashed: null });
                    setChecked([]);
                  }
                }}>
                <span
                  className={`${
                    !params.trashed ? "" : "text-white"
                  } mr-1 font-semibold`}>
                  {__("Archive")}
                </span>{" "}
                <Archive className={!params.trashed ? "" : "text-white"} />
              </Button>
            )}
          </div>
        </div>
        <Table>
          <TableHeader className="bg-gray-200 ">
            <TableRow>
              {check && (
                <TableHead className="border w-0 ">
                  <Checkbox
                    className="mb-2"
                    onCheckedChange={() => {
                      setIsCheckAll(!isCheckAll);
                      checkAll();
                    }}
                    aria-label="Select row"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.name}
                  style={{}}
                  className={column.className}>
                  {column.sortable ? (
                    <button
                      onClick={() => {
                        if (
                          params.sort_column === column.name &&
                          params.sort_direction === "asc"
                        ) {
                          setParams({
                            ...params,
                            sort_column: column.name,
                            sort_direction: "desc",
                          });
                        } else {
                          setParams({
                            ...params,
                            sort_column: column.name,
                            sort_direction: "asc",
                          });
                        }
                      }}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10  py-2">
                      <p className="font-bold">{column.label}</p>
                      <ChevronsUpDown className="ml-1" size={15} />
                    </button>
                  ) : (
                    <p className="font-bold">{column.label}</p>
                  )}
                </TableHead>
              ))}
              <TableHead className="flex justify-end items-center"></TableHead>
            </TableRow>
          </TableHeader>

          {loading && (
            <TableBody>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, key) => (
                <TableRow key={key}>
                  <TableCell colSpan={columns.length + 2}>
                    <Skeleton className="w-[100%] h-[20px] " />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}

          {!loading && rowTree && <RowTree rows={data.data} />}

          {/* DI SINI TREE NYA */}
          {!loading && !rowTree && (
            <TableBody>
              {data.data.map((row: any, index: number) => {
                if (data.data.length > 0) {
                  return (
                    <TableRow
                      key={useUuid ? row.uuid : row.id}
                      className={`${
                        checked.includes(useUuid ? row.uuid : row.id)
                          ? "bg-gray-100"
                          : ""
                      } items-center`}>
                      {check && (
                        <TableCell>
                          <Checkbox
                            className="mb-2"
                            checked={checked?.includes(
                              useUuid ? row.uuid : row.id
                            )}
                            onCheckedChange={() => {
                              setChecked((prevData: any) =>
                                xor(prevData, [useUuid ? row.uuid : row.id])
                              );
                            }}
                            aria-label="Select row"
                          />
                        </TableCell>
                      )}
                      {columns.map((column: DatatableColumn) => (
                        <TableCell key={column.name}>
                          {column.render
                            ? column.render(row)
                            : row[column.name]}
                        </TableCell>
                      ))}
                      <TableCell className="flex justify-end items-center">
                        {/* non achieved */}
                        {params.trashed == null && (
                          <DropdownComponent
                            button={
                              <EllipsisVertical className="hover:cursor-pointer" />
                            }
                            align="end">
                            {canShow && (
                              <DropdownMenuItem
                                className="flex hover:cursor-pointer mb-1 items-center  "
                                onSelect={(e) => {
                                  setTimeout(() => {
                                    handleDetail(row, true);
                                  }, 1);
                                }}>
                                <Eye size={1.5} />

                                <p className="ml-1 text-sm">{__("Detail")}</p>
                              </DropdownMenuItem>
                            )}

                            {canUpdate && (
                              <DropdownMenuItem
                                className="flex hover:cursor-pointer mb-1 items-center  "
                                onClick={() => {
                                  setTimeout(() => {
                                    handleUpdate(row);
                                  }, 1);
                                }}>
                                <Pencil size={1.5} />
                                <p className="ml-1 text-sm">{__("Edit")}</p>
                              </DropdownMenuItem>
                            )}

                            {checked.length < 1 && canDelete && (
                              <DropdownMenuItem
                                className="flex hover:cursor-pointer mb-1 items-center  "
                                onClick={() => {
                                  setTimeout(() => {
                                    handleDelete(useUuid ? row.uuid : row.id);
                                  }, 1);
                                }}>
                                <Trash size={1.5} />
                                <p className="ml-1 text-sm">{__("Delete")}</p>
                              </DropdownMenuItem>
                            )}

                            {otherActionTableBody.length > 0 &&
                              otherActionTableBody?.map(
                                (item: OtherActioType, index: number) =>
                                  item.permission && (
                                    <DropdownMenuItem
                                      key={item.title}
                                      className="flex hover:cursor-pointer mb-1 items-center  "
                                      onSelect={(e) => {
                                        setTimeout(() => {
                                          item.onClick(row);
                                        }, 1);
                                      }}>
                                      <Eye size={1.5} />

                                      <p className="ml-1 text-sm">
                                        {item.title}
                                      </p>
                                    </DropdownMenuItem>
                                  )
                              )}
                          </DropdownComponent>
                        )}

                        {/* achieved */}
                        {params.trashed != null && checked.length < 1 && (
                          <DropdownComponent
                            button={
                              <EllipsisVertical className="hover:cursor-pointer" />
                            }
                            align="end">
                            <DropdownMenuItem
                              className="flex hover:cursor-pointer mb-1 items-center  "
                              onClick={() => {
                                setTimeout(() => {
                                  handleRestore(useUuid ? row.uuid : row.id);
                                }, 1);
                              }}>
                              <ArchiveRestore className="text-lime-600" />
                              <p className="ml-1 text-lime-600 font-semibold">
                                {__("Restore Data")}
                              </p>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="flex hover:cursor-pointer mb-1 items-center  "
                              onClick={() => {
                                setTimeout(() => {
                                  handlePermanentDelete(
                                    useUuid ? row.uuid : row.id
                                  );
                                }, 1);
                              }}>
                              <Trash className="text-red-600" />
                              <p className="ml-1 text-red-600 font-semibold">
                                {__("Delete Permanent")}
                              </p>
                            </DropdownMenuItem>
                          </DropdownComponent>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                }

                if (data.data.length < 1) {
                  return <>data empty</>;
                }
              })}
            </TableBody>
          )}
        </Table>
      </div>
      {!loading && (
        <div className="mt-5">
          <Pagination>
            <PaginationContent>
              {data.links.map((link: any) =>
                paginationLabel(link.label, link.active)
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
