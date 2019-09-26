/*! dispatcher.js at 2017.06.16 21:58 */
import { Dispatcher } from "flux";

class AppDispatcher extends Dispatcher {
    dispatch(action = {}) {
        super.dispatch(action);
    }
}

export default new AppDispatcher();
