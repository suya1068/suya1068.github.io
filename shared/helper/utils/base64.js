const Base64 = {
    // public method for encoding
    encode: input => {
        const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        let output = "";
        let chr1 = "";
        let chr2 = "";
        let chr3 = "";
        let enc1 = "";
        let enc2 = "";
        let enc3 = "";
        let enc4 = "";
        let i = 0;

        while (i < input.length) {
            chr1 = input.charCodeAt(i += 1);
            chr2 = input.charCodeAt(i += 1);
            chr3 = input.charCodeAt(i += 1);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }

        return output;
    },
    // public method for decoding
    decode: input => {
        const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        let output = "";
        let chr1 = "";
        let chr2 = "";
        let chr3 = "";
        let enc1 = "";
        let enc2 = "";
        let enc3 = "";
        let enc4 = "";
        let i = 0;

        input = input.replace(/[^A-Za-z0-9+/=]/g, "");

        while (i < input.length) {
            enc1 = keyStr.indexOf(input.charAt(i += 1));
            enc2 = keyStr.indexOf(input.charAt(i += 1));
            enc3 = keyStr.indexOf(input.charAt(i += 1));
            enc4 = keyStr.indexOf(input.charAt(i += 1));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output += String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output += String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output += String.fromCharCode(chr3);
            }
        }

        return output;
    }
};

export default Base64;
