// import moment from "moment";

// export function FormatDateTime(dateTime: string) {
//   return moment(dateTime).format("DD-MM-YYYY HH:mm");
// }
// export function FormatDate(date: string) {
//   return moment(date).format("DD-MM-YYYY");
// }
// export function FormatTime(time: string) {
//   return moment(time).format("HH:mm");
// }
import moment from "moment";
moment.locale("id");

const formatDateTime = (dateTime: string) => {
  return moment(dateTime).format("DD-MM-YYYY HH:mm");
};
const formatDate = (date: string) => {
  return moment(date).format("ddd, D MMM YYYY");
};
const formatTime = (time: string) => {
  return moment(time).format("HH:mm");
};

export { formatDateTime, formatDate, formatTime };
