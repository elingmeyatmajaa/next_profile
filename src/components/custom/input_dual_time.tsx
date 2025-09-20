import { useEffect, useState } from "react";

type InputTimeProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  error?: string[];
  onChange: (e: any) => void;
};
export default function InputDualTime({
  icon,
  label,
  value,
  error,
  onChange,
}: InputTimeProps) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [begin, setBegin] = useState(0);

  useEffect(() => {
    function trimTime() {
      if (value && begin === 0) {
        let [startTime, endTime] = value
          .split(" - ")
          .map((time) => time.trim());
        setStart(startTime);
        setEnd(endTime);
        setBegin(1);
      }
    }
    trimTime();
  }, [value]);

  useEffect(() => {
    onChange({ target: { value: `${start} - ${end}` } });
  }, [start, end]);

  return (
    <>
      <h3 className="font-semibold mb-1">{label}</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="start-time"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Start time:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
              {icon}
            </div>
            <input
              type="time"
              id="start-time"
              className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="end-time"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            End time:
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
              {icon}
            </div>
            <input
              type="time"
              id="end-time"
              className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      {error &&
        error.map((item, index) => (
          <div key={index} className="text-red-500 mt-1 text-xs">
            {item}
          </div>
        ))}
    </>
  );
}
