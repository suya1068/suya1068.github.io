const users = {
    local: {
        port: {
            livereload: 3000,
            karma: 9875
        },
        proxy: "http://192.168.33.10:8080",
        host: {
            desktop: "localhost",
            mobile: ""
        },
        server: {
            img: "",
            data: "",
            api: ""
        }
    },
    smchun: {
        port: {
            livereload: 3005,
            karma: 9875
        },
        proxy: "http://smchun-forsnap.com",
        host: {
            web: "smchun-forsnap.com",
            desktop: "smchun-forsnap.com",
            mobile: "m.smchun-forsnap.com"
        },
        server: {
            img: "http://image.smchun-forsnap.com",
            data: "http://data.smchun-forsnap.com",
            api: "http://api.beta-forsnap.com",
            // thumb: "http://thumb.beta-forsnap.com"
            thumb: "http://thumbnail.beta-forsnap.com:22010"
        }
    },
    jschoi: {
        port: {
            livereload: 3006,
            karma: 9876
        },
        proxy: "http://jschoi-forsnap.com",
        host: {
            web: "jschoi-forsnap.com",
            desktop: "jschoi-forsnap.com",
            mobile: "m.jschoi-forsnap.com"
        },
        server: {
            img: "http://image.jschoi-forsnap.com",
            data: "http://data.jschoi-forsnap.com",
            api: "http://api.beta-forsnap.com",
            // api: "http://api.jspark-forsnap.com",
            // thumb: "http://thumb.beta-forsnap.com"
            thumb: "http://thumbnail.beta-forsnap.com:22010"
        }
    },
    sskim: {
        port: {
            livereload: 3007,
            karma: 9877
        },
        proxy: "http://sskim-forsnap.com",
        host: {
            web: "sskim-forsnap.com",
            desktop: "sskim-forsnap.com",
            mobile: "m.sskim-forsnap.com"
        },
        server: {
            img: "http://image.sskim-forsnap.com",
            data: "http://data.sskim-forsnap.com",
            // api: "http://api.mschoo-forsnap.com",
            api: "http://api.beta-forsnap.com",
            // thumb: "http://thumb.beta-forsnap.com"
            thumb: "http://thumbnail.beta-forsnap.com:22010"
        }
    },
    jujeong: {
        port: {
            livereload: 3008,
            karma: 9878
        },
        proxy: "http://jujeong-forsnap.com",
        host: {
            web: "jujeong-forsnap.com",
            desktop: "jujeong-forsnap.com",
            mobile: "m.jujeong-forsnap.com"
        },
        server: {
            img: "http://image.jujeong-forsnap.com",
            data: "http://data.jujeong-forsnap.com",
            // api: "http://api.beta-forsnap.com",
            api: "http://api.mschoo-forsnap.com",
            // api: "http://api.jspark-forsnap.com",
            // thumb: "http://thumb.beta-forsnap.com"
            thumb: "http://thumbnail.beta-forsnap.com:22010"
        }
    }
};

exports.dev = users;

exports.beta = {
    host: {
        web: "beta-forsnap.com",
        desktop: "beta-forsnap.com",
        mobile: "m.beta-forsnap.com"
    },
    server: {
        img: "http://image.beta-forsnap.com",
        data: "http://data.beta-forsnap.com",
        // api: "http://api.mschoo-forsnap.com",
        api: "http://api.beta-forsnap.com",
        // thumb: "http://thumb.beta-forsnap.com"
        thumb: "http://thumbnail.beta-forsnap.com:22010"
    }
};

exports.stage = {
    host: {
        web: "stage-forsnap.com",
        desktop: "stage-forsnap.com",
        mobile: "m.stage-forsnap.com"
    },
    server: {
        web: "stage-forsnap.com",
        img: "http://image.stage-forsnap.com",
        data: "http://data.stage-forsnap.com",
        api: "http://api.stage-forsnap.com",
        // thumb: "http://thumb.stage-forsnap.com"
        thumb: "https://thumbnail2.forsnap.com"
    }
};

exports.live = {
    host: {
        web: "forsnap.com",
        desktop: "forsnap.com",
        mobile: "m.forsnap.com"
    },
    server: {
        img: "https://image.forsnap.com",
        data: "https://data.forsnap.com",
        api: "https://api.forsnap.com",
        // thumb: "https://thumb.forsnap.com"
        thumb: "https://thumbnail2.forsnap.com"
    }
};
