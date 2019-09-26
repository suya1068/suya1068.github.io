const filter = /Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile|X11/i;

const agent = {
    isMobile() {
        return filter.test(navigator.userAgent);
    }
};

export default agent;
