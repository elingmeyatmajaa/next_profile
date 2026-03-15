import { atom } from "recoil";

const permissionState = atom({
  key: "permissionState",
  default: [],
});
export { permissionState };
