import PhotoListHelperOrigin from "./PhotoListHelperOrigin";
import PhotoListHelperCustom from "./PhotoListHelperCustom"

export default {
    create(type) {
        if (type === "origin") {
            return new PhotoListHelperOrigin();
        }

        return new PhotoListHelperCustom();
    }
};
