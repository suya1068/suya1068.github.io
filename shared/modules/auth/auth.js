const auth = {
    create(success, fail) {
        this.success = typeof success === "function" ? success : null;
        this.fail = typeof fail === "function" ? fail : null;
    },
    success: null,
    fail: null
};

export default auth;
