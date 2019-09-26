import ConsultLoginDesktop from "./login/ConsultLoginDesktop";
import ConsultLoginMobile from "./login/ConsultLoginMobile";

export default {
    create(device_type) {
        if (device_type === "mobile") {
            return new ConsultLoginMobile();
        }
        return new ConsultLoginDesktop();
    }
};
