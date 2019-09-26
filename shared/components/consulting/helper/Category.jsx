import API from "forsnap-api";

class ConsultingCategory {
    setCategorys(categorys) {
        this.categorys = categorys;
    }

    getCategorys() {
        return API.products.categorys()
            .then(
                response => {
                    const data = response.data;
                    this.setCategorys({
                        category: data.category
                    });
                    return data;
                },
                error => Promise.reject(error)
            );
    }
}

export default ConsultingCategory;
