import React from "react";
import API from "forsnap-api";

function getOriginPhotos(buyNo, productNo, offset, limit) {
    return API.reservations.reservePhotosOrigin(buyNo, productNo, "U", offset, limit);
}

function getCustomPhotos(buyNo, productNo, offset, limit) {
    return API.reservations.reservePhotosCustom(buyNo, productNo, "U", offset, limit);
}

export default {
    getOriginPhotos,
    getCustomPhotos
};
