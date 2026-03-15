import { permissionState } from "@/app/admin/recoils/states";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";

export default function can(ability: string | Array<string>): boolean {
  return true;
  // const _permissions = useRecoilValue(permissionState);
  // const permissions = (_permissions || []) as string[];
  // if (typeof ability === "string") {
  //   return permissions.includes(ability);
  // }
  // if (Array.isArray(ability)) {
  //   return ability.some((permission) => permissions.includes(permission));
  // }
  // return false;
}
