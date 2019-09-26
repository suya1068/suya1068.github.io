import DesktopJoin from "./join/DesktopJoin";
import MobileJoin from "./join/MobileJoin";

export default {
    create(is_mobile) {
        if (is_mobile) {
            return new MobileJoin();
        }
        return new DesktopJoin();
    }
};
