"use client";

import React, { useCallback, useEffect, useState } from "react";
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

import { ChevronsUpDown } from "lucide-react";
import { SelectComponent } from "@/components/custom/select-component";
import { Skeleton } from "@/components/ui/skeleton";
import { IconChevronLeft } from "@tabler/icons-react";

type DatatableColumn = {
  name: string;
  label: string;
  render?: (e: any) => React.ReactNode;
  className?: string;
  isDetailTrigger?: boolean;
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

type DatatableType = {
  url: string;
  columns: DatatableColumn[];
  columnsDetail: DatatableColumn[];
  handleApplyQuantity: (e: any[] | string) => void;
  afterApplyQuantity: () => void;
  check?: boolean;
  detailKey: string;
  reload: boolean;
};

export default function DataTableForBrowseData({
  url,
  detailKey = "items",
  columns,
  columnsDetail,
  handleApplyQuantity,
  afterApplyQuantity,
  check,
  reload,
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

  const [isDetail, setIsDetail] = useState(false);

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

  const [detailData, setDetailData] = useState<{
    data: { [key: string]: any[] };
  }>({ data: { [detailKey]: [] } });

  async function fetchDetailData(
    url: string = "",
    uuid: "string",
    setter: (data: any) => void
  ) {
    try {
      setLoading(true);
      const { data } = await HttpClient.GET(`${url}/${uuid}`, params);
      setter(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }

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
        newChecked.push(item.uuid);
      });
      setChecked(newChecked);
    } else {
      setChecked([]);
    }
  };

  const zebraColour = (index: number) => {
    return index % 2 === 0 ? "bg-gray-50" : "bg-white";
  };

  const renderTableBody = (column: DatatableColumn, row: any) => {
    if (column.render) {
      if (column.isDetailTrigger) {
        return (
          <div
            className="text-emerald-600 hover:cursor-pointer hover:text-emerald-500"
            onClick={() => {
              setIsDetail(!isDetail);
              fetchDetailData(url, row.uuid, setDetailData);
            }}>
            <p className="font-semibold">{column.render(row)}</p>
          </div>
        );
      } else {
        return column.render(row);
      }
    } else {
      if (column.isDetailTrigger) {
        return (
          <Button
            className="bg-white text-emerald-600 border-emerald-500  hover:bg-emerald-400 hover:text-white"
            onClick={() => {
              setIsDetail(!isDetail);
              fetchDetailData(url, row.uuid, setDetailData);
            }}>
            <p className="font-semibold">{row[column.name]}</p>
          </Button>
        );
      } else {
        return row[column.name];
      }
    }
  };

  return (
    <>
      {/* Main */}
      {!isDetail && (
        <div className="">
          <div className="rounded-md">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center ">
                <Input
                  type="search"
                  placeholder="Cari..."
                  value={params.search}
                  onChange={(e) =>
                    setParams({ ...params, search: e.target.value })
                  }
                />
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
                <Button
                  className=" hover:bg-white hover:text-emerald-500 border-emerald-500  bg-emerald-500 text-white flex items-center justify-between ml-3"
                  onClick={() => {
                    handleApplyQuantity(checked);
                    afterApplyQuantity();
                  }}>
                  <span className="mr-1 font-semibold ">Apply Item</span>
                </Button>
              </div>
            </div>

            <Table className="border">
              <TableHeader className="bg-gray-200 ">
                <TableRow>
                  {check && !loading && (
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
                  {[0, 1, 2].map((item, key) => (
                    <TableRow key={key}>
                      <TableCell colSpan={columns.length + 2}>
                        <Skeleton className="w-[100%] h-[20px] " />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}

              {/* DI SINI TREE NYA */}
              {!loading && (
                <TableBody>
                  {data.data.map((row: any, index: number) => {
                    if (data.data.length > 0) {
                      return (
                        <TableRow
                          key={row.uuid}
                          className={`${
                            checked.includes(row.uuid) ? "bg-gray-100" : ""
                          } items-center`}>
                          {check && (
                            <TableCell>
                              <Checkbox
                                className="mb-2"
                                checked={checked?.includes(row.uuid)}
                                onCheckedChange={() => {
                                  setChecked((prevData: any) =>
                                    xor(prevData, [row.uuid])
                                  );
                                }}
                                aria-label="Select row"
                              />
                            </TableCell>
                          )}
                          {columns.map((column: DatatableColumn) => (
                            <TableCell key={column.name}>
                              {renderTableBody(column, row)}
                            </TableCell>
                          ))}
                          <TableCell className="flex justify-end items-center"></TableCell>
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
            <div className="mt-5 ">
              <Pagination>
                <PaginationContent>
                  {data.links.map((link: any) =>
                    paginationLabel(link.label, link.active)
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}

      {/* Detail */}
      {isDetail && (
        <div className="">
          <div className="rounded-md">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center ">
                <Button
                  className=" "
                  variant={"outline"}
                  onClick={() => {
                    setIsDetail(!isDetail);
                  }}>
                  <span className="font-semibold ">
                    <IconChevronLeft />
                  </span>
                  Back
                </Button>
              </div>
              <div className="flex">
                <h3 className="text-lg font-semibold">Detail Item</h3>
              </div>
            </div>

            <Table className="border">
              <TableHeader className="bg-gray-200 ">
                <TableRow>
                  {columnsDetail.map((column) => (
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
                  {[0, 1, 2].map((item, key) => (
                    <TableRow key={key}>
                      <TableCell colSpan={columnsDetail.length + 2}>
                        <Skeleton className="w-[100%] h-[20px] " />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}

              {/* DI SINI TREE NYA */}
              {!loading && (
                <TableBody>
                  {detailData.data[detailKey].map((row: any, index: number) => {
                    if (detailData.data[detailKey].length > 0) {
                      return (
                        <TableRow
                          key={row.uuid}
                          className={`${
                            checked.includes(row.uuid) ? "bg-gray-100" : ""
                          } items-center`}>
                          {columnsDetail.map((column: DatatableColumn) => (
                            <TableCell key={column.name}>
                              {renderTableBody(column, row)}
                            </TableCell>
                          ))}
                          <TableCell className="flex justify-end items-center"></TableCell>
                        </TableRow>
                      );
                    }

                    if (detailData.data[detailKey].length < 1) {
                      return <>data empty</>;
                    }
                  })}
                </TableBody>
              )}
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
