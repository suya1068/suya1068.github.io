# 개발

## desktop service

### 1. Setup
```
// git에서 프로젝트를 클론한다.
git clone git@bitbucket.org:forsnap/web.git    

// 모듈을 설치한다.
cd web && npm install
cd desktop && composer update

// 로그를 위한 폴더 권한을 설정한다.
chmod 777 storage
```

### 2. Usage
> 프로젝트 ROOT 패스에서 명령어를 실행한다.

#### (1) Desktop
* dev
```
npm run desktop:dev -- --env.name=[name]
```

* beta
```
npm run desktop:beta
```

* stage
```
npm run desktop:stage
```

* live
```
npm run desktop:live
```

#### (2) Mobile
* dev
```
npm run mobile:dev -- --env.name=[name]
```

* beta
```
npm run mobile:beta
```

* stage
```
npm run mobile:stage
```

* live
```
npm run mobile:live
```
