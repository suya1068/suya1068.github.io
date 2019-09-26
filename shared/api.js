import UsersAPI from "shared/api/users/users.api";
import AuthAPI from "shared/api/users/auth.api";
import ArtistsAPI from "shared/api/artists/artists.api";
import ProductsAPI from "shared/api/products/products.api";
import ReservationsAPI from "shared/api/reservations/reservations.api";
import TalksAPI from "shared/api/talks/talks.api";
import BoardAPI from "shared/api/cs/board.api";
import OrdersAPI from "shared/api/orders/orders.api";
import OffersAPI from "shared/api/offers/offers.api";
import LffersAPI from "shared/api/life/life.api";
import CommonAPI from "shared/api/common/common.api";
import StatusAPI from "shared/api/status/status.api";
import LogsAPI from "shared/api/logs/logs.api";
import JoinAPI from "shared/api/users/join.api";

const map = {
    users: UsersAPI,
    auth: AuthAPI,
    artists: ArtistsAPI,
    products: ProductsAPI,
    reservations: ReservationsAPI,
    talks: TalksAPI,
    cs: BoardAPI,
    orders: OrdersAPI,
    offers: OffersAPI,
    life: LffersAPI,
    common: CommonAPI,
    status: StatusAPI,
    logs: LogsAPI,
    join: JoinAPI
};

const inject = (instance, data = []) => {
    return data.length > 0
        ? data.reduce((box, { key, alias, name }) => {
            const Api = map[key];
            const k = typeof alias === "string" ? alias : key;
            box[k] = new Api(instance);
            return box;
        }, {})
        : Object.entries(map).reduce((box, [key, Api]) => {
            box[key] = new Api(instance);
            return box;
        }, {});
};

export default { inject };
