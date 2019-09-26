import EstimateListHelperProgress from "./EstimateListHelperProgress";
import EstimateListHelperComplete from "./EstimateListHelperComplete";
import auth from "forsnap-authentication";

export default {
    create(tab) {
        if (tab === "progress" && auth.getUser()) {
            return new EstimateListHelperProgress(auth.getUser().id);
        }

        return new EstimateListHelperComplete();
    }
};
