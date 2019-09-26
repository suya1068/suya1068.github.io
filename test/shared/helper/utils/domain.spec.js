import domain from "shared/helper/utils/domain";


describe("domain", () => {
    it("isValid function은 입력받은 데이터가 유효한 도메인일 경우 true를 반환한다.", () => {
        const given = [
            "http",
            "https",
            "naver.com",
            "http://naver.com",
            "https://naver.com",
            "m.naver.com",
            "http://m.naver.com",
            "https://m.naver.com",
            "http://blog.naver.com/1923/travel",
            "http://blog.naver.com/1923/travel/index.html",
            "192.168.13.10",
            "192.168.13.10:8000",
            "photocom21.helppr.kr/shop_2/photo.php?&start=40",
            "www.webhard.co.kr/",
            "nicephotonice.modoo.at/",
            "caramel.ly/",
            "www.snaaaper.com/category.php?category=816",
            "snaaaper.com/category.php?category=816",
            "egloos.zum.com/rucaus/v/2405770",
            "nalpari.blogspot.kr/2014/12/blog-post_29.html"
        ];

        const result = given.every(data => domain.isValid(data));
        expect(result).toBe(true);
    });

    it("match function은 입력받은 데이터에서 유효한 도메인 리스트를 반환한다.", () => {
        const given = `
            URL 테스트 중입니다.
            테스트 URL은
            http://, https://,
            naver.com, www.naver.com:8080, http://naver.com, http://www.naver.com, https://naver.com, https://www.naver.com
            http://blog.naver.com/1923/travel, http://blog.naver.com:8000/1923/travel/index.html 입니다.
        `;

        const result = domain.match(given);
        expect(result.length).toEqual(10);
    });

    it("include function은 입력받은 데이터가 유효한 도메인을 포함할 경우 true를 반환한다.", () => {
        const given1 = `
            URL 테스트 중입니다.
            테스트 URL은
            http://, https://,
            naver.com, www.naver.com:8080, http://naver.com, http://www.naver.com, https://naver.com, https://www.naver.com
            http://blog.naver.com/1923/travel, http://blog.naver.com:8000/1923/travel/index.html 입니다.
        `;

        const result1 = domain.includes(given1);
        expect(result1).toBe(true);


        const given2 = `
            URL 테스트 중입니다.
            테스트 URL은 없습니다.
            http://test.com:8000
            http://mew-test.com
            http://m.mew-test.com
            naver.com
        `;

        const result2 = domain.includes(given2, domain => !/((http|https):\/\/)?(m.)?test.com(:[\\d]+)?(\/\S*)?/g.test(domain));
        expect(result2).toBe(true);
    });


    it("include function은 입력받은 데이터가 유효한 도메인을 포함하지 않을 경우 false를 반환한다.", () => {
        const given1 = `
            URL 테스트 중입니다.
            테스트 URL은 없습니다.
        `;

        const result1 = domain.includes(given1);
        expect(result1).toBe(false);


        const given2 = `
            URL 테스트 중입니다.
            테스트 URL은 없습니다.
            http://test.com:8000
            http://mew-test.com
            http://m.mew-test.com
        `;

        const result2 = domain.includes(given2, domain => !/((http|https):\/\/)?(m.)?test.com(:[\\d]+)?(\/\S*)?/g.test(domain));
        expect(result2).toBe(false);
    });

    it("includesExceptForsnap function은 입력받은 데이터가 포스냅 도메인을 제외한 유효한 도메인을 포함하지 않을 경우 false를 반환한다.", () => {
        const given = `
            URL 테스트 중입니다.
            테스트 URL은 없습니다.
            https://forsnap.com
            https://m.forsnap.com
            https://m.forsnap.com/products?tag=웨딩
            https://m.forsnap.com/products/321
        `;

        const result = domain.includesExceptForsnap(given);
        expect(result).toBe(false);
    });

    it("includesExceptForsnap function은 입력받은 데이터가 포스냅 도메인을 제외한 유효한 도메인을 포함할 경우 true를 반환한다.", () => {
        const given = `
            URL 테스트 중입니다.
            테스트 URL은 없습니다.
            https://forsnap.com
            https://m.forsnap.com
            https://m.forsnap.com/products?tag=웨딩
            https://m.forsnap.com/products/321
            forsnap.com
        `;

        const result = domain.includesExceptForsnap(given);
        expect(result).toBe(true);
    });
});
