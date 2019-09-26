import PhotographComment from "./PhotographComment";
import api from "forsnap-api";

class PhotographCommentGuest extends PhotographComment {
    constructor() {
        super();

        this.user = { id: "", name: "" };
        this.photographer = null;
        this.upload = null;
    }

    getUploadPolicyAndPhotographer(artist_nick_name) {
        return api.users.fetchPhotographerAndGuestUploadPolicy(artist_nick_name)
            .then(
                response => {
                    const data = response.data;
                    this.setUserId(data.temp_user_id);
                    this.setUploadPolicy(data.upload_info);
                    this.setPhotographer({
                        artist_id: data.artist_id,
                        nick_name: data.nick_name,
                        profile_image: data.profile_img
                    });
                    return data;
                },
                error => Promise.reject(error)
            );
    }

    registerPhotographReview(form) {
        return api.users.createGuestPhotographComment(Object.assign(form, { temp_user_id: this.user_id }));
    }
}

export default PhotographCommentGuest;
