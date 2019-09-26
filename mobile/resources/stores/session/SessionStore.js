import { ReduceStore } from "flux/utils";
import Auth from "forsnap-authentication";
import AppDispatcher from "mobile/resources/AppDispatcher";
import * as CONST from "../constants";


class SessionStore extends ReduceStore {
    getInitialState() {
        const session = Auth.getUser();
        let entity = null;

        if (session) {
            entity = { id: session.id, apiToken: session.apiToken };

            if (session.data) {
                entity = { ...session.data, ...entity };
            }
        }

        return {
            entity,
            access: false,
            meta: { loading: false },
            breadcrumb: ""
        };
    }

    reduce(state, action) {
        switch (action.type) {
            case CONST.GLOBAL_SESSION_SAVE: {
                const payload = action.payload;
                const info = payload.session_info;

                const session = {
                    apiToken: payload.api_token,
                    id: payload.user_id,
                    artistNo: payload.artist_no,
                    email: payload.email,
                    name: payload.name,
                    nick_name: info.nick_name || null,
                    profile_img: payload.profile_img,
                    is_artist: info.is_artist,
                    is_login: info.is_login,
                    notice_count: info.notice_count,
                    rest_dt: payload.rest_dt,
                    block_dt: payload.block_dt
                };

                if (info.order_count) {
                    session.order_count = info.order_count;
                }

                Auth.setUser(payload.user_id, session);

                return { ...state, entity: session };
            }

            case CONST.GLOBAL_SESSION_UPDATE: {
                const payload = action.payload;

                const info = {
                    name: payload.name || null,
                    nick_name: payload.nick_name || null,
                    profile_img: payload.profile_img,
                    artist_profile_img: payload.artist_profile_img,
                    notice_count: payload.notice_count,
                    artist_notice_count: payload.artist_notice_count,
                    is_artist: payload.is_artist,
                    is_login: payload.is_login,
                    rest_dt: payload.rest_dt,
                    block_dt: payload.block_dt
                };

                if (payload.order_count) {
                    info.order_count = payload.order_count;
                }

                Auth.local.updateUser(payload.user_id, info);

                return { ...state, entity: { ...state.entity, ...info } };
            }

            case CONST.GLOBAL_SESSION_REMOVE: {
                Auth.removeUser();

                return { ...state, entity: null, access: false };
            }

            case CONST.GLOBAL_SESSION_ACCESS_PAGE: {
                return { ...state, access: true };
            }

            case CONST.GLOBAL_SESSION_NOT_ACCESS_PAGE: {
                Auth.removeUser();
                return { ...state, access: false };
            }

            default:
                return state;
        }
    }
}

export default new SessionStore(AppDispatcher);
