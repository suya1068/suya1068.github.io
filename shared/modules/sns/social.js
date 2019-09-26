class Social {
    constructor({ type, responseType = "code", clientId, requestURI, redirectURI, state = "" }) {
        if (!type || !clientId || !requestURI || !redirectURI) {
            throw new TypeError("The parameter is invalid.");
        }

        this.type = type;
        this.responseType = responseType;
        this.clientId = clientId;
        this.requestURI = requestURI;
        this.redirectURI = redirectURI;
        this.state = state;
    }

    login() {
        let url = `${this.requestURI}?response_type=${this.responseType}&client_id=${this.clientId}&redirect_uri=${this.redirectURI}&state=${this.state}`;
        if (this.type === "facebook") {
            url = `${url}&scope=email,public_profile`;
        }

        this.open(url);
    }

    open(url) {
        const options = "titlebar=1,resizable=1,scrollbars=yes,width=600,height=550";
        window.open(url, "loginPopup", options);
    }
}

export default Social;
