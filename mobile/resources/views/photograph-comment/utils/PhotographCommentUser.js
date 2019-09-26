import PhotographComment from "./PhotographComment";
import api from "forsnap-api";

class PhotographCommentUser extends PhotographComment {
    constructor(user_id) {
        super();

        this.user_id = user_id;
        this.photographer = null;
        this.upload = null;
    }

    getUploadPolicyAndPhotographer(artist_nick_name) {
        return api.users.fetchPhotographerAndUploadPolicy(this.user_id, artist_nick_name)
            .then(
                response => {
                    const data = response.data;
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
        return api.users.createPhotographComment(this.user_id, form);
    }
}

export default PhotographCommentUser;
