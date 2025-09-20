import Link from "next/link";
import { Button } from "./button";

export default function Pagination({
  data: { from, to, total, links, current_page: currentPage },
  query,
  path,
}: {
  data: TableDataType;
  query: any;
  path: string;
}) {
  const renderItem = (link: any, key: number) => {
    if (link.url == null) {
      return (
        <Button
          key={key}
          disabled={true}
          size="sm"
          variant={link.active ? "outline" : "ghost"}
          className="mr-1 ml-1"
          dangerouslySetInnerHTML={{ __html: link.label }}></Button>
      );
    }
    if (link.label == "&laquo; Previous") {
      return (
        <Button
          key={key}
          size="sm"
          variant={link.active ? "outline" : "ghost"}
          className="mr-1 ml-1"
          dangerouslySetInnerHTML={{ __html: link.label }}></Button>
      );
    } else if (link.label == "Next &raquo;") {
      return (
        <Button
          key={key}
          size="sm"
          variant={link.active ? "outline" : "ghost"}
          className="mr-1 ml-1"
          dangerouslySetInnerHTML={{ __html: link.label }}></Button>
      );
    }
    return (
      <Button
        key={key}
        size="sm"
        variant={link.active ? "outline" : "ghost"}
        className="mr-1 ml-1"
        dangerouslySetInnerHTML={{ __html: link.label }}></Button>
    );
  };
  return (
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{from}</span> to{" "}
          <span className="font-medium">{to}</span> of{" "}
          <span className="font-medium">{total}</span> results
        </p>
      </div>
      <div>
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination">
          {links.map((link, key: number) => {
            if (link.url == null) {
              return (
                <div
                  key={key}
                  className="relative inline-flex items-center  px-4 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  dangerouslySetInnerHTML={{
                    __html: link.label,
                  }}></div>
              );
            } else if (link.active) {
              return (
                <div
                  key={key}
                  className="relative bg-sky-600 inline-flex items-center  px-4 py-2 text-white ring-1 ring-inset ring-gray-300  focus:z-20 focus:outline-offset-0"
                  dangerouslySetInnerHTML={{
                    __html: link.label,
                  }}></div>
              );
            } else if (link.label == "&laquo; Previous") {
              return (
                <Link
                  key={key}
                  href={`/${path}?${new URLSearchParams({
                    ...query,
                    page: `${currentPage - 1}`,
                  })}`}
                  className="relative inline-flex items-center  px-4 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  dangerouslySetInnerHTML={{
                    __html: link.label,
                  }}></Link>
              );
            } else if (link.label == "Next &raquo;") {
              return (
                <Link
                  key={key}
                  href={`/${path}?${new URLSearchParams({
                    ...query,
                    page: `${currentPage + 1}`,
                  })}`}
                  className="relative inline-flex items-center  px-4 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  dangerouslySetInnerHTML={{
                    __html: link.label,
                  }}></Link>
              );
            }
            return (
              <Link
                key={key}
                href={`/${path}?${new URLSearchParams({
                  ...query,
                  page: link.label,
                })}`}
                className="relative inline-flex items-center  px-4 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                dangerouslySetInnerHTML={{
                  __html: link.label,
                }}></Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
