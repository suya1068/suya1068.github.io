const dom = {
    createDownloadLink(url, id = "forsnapDownload") {
        let node = document.getElementById(id);

        if (!node) {
            node = document.createElement("a");
            node.setAttribute("download", id);
            node.setAttribute("id", id);
            node.setAttribute("class", "sr-only");
            document.body.appendChild(node);
        }

        node.setAttribute("href", url);

        return node;
    }
};

export default dom;
