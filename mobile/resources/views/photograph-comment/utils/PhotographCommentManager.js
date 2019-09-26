import PhotographCommentUser from "./PhotographCommentUser";
import PhotographCommentGuest from "./PhotographCommentGuest";

export default {
    create(user_id) {
        if (user_id) {
            return new PhotographCommentUser(user_id);
        }

        return new PhotographCommentGuest();
    }
};
