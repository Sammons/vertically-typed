import { RestInterface } from "./rest-interface";
import { definition } from "./rest-definition";
import { Omit } from "../lib/type-utils";

export type RestUser = typeof definition.get._users_$id.shape.payload;

export const Client = new class {
  interface = new RestInterface({
    host: "localhost:8081", // where the backend is
    headers: {}, // any fixed headers, such as auth via some "Authorization: Bearer ..."
    origin: "*"
  });
  async getUserById(id: string): Promise<RestUser> {
    // this client uses superagent,
    // .req contains the superagent request, which can be aborted
    return this.interface.get._users_$id({ id }).value;
  }
  async createUser(u: Omit<RestUser, "id">): Promise<RestUser> {
    return this.interface.post._users({}, u).value;
  }
}();
