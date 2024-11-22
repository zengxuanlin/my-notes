
# 记录了shell脚本简单爬虫示例

> 仅供参考，业务实现的是登陆后获取食堂菜单内容 写入html 并且打开   

<br>

```bash
#!/bin/bash
baseUrl="https://gzdxoa.gzdx.com.cn:30081/api"

infoName="token.txt"

menuFile="menu.html"

# 判断操作系统类型
OS=$(uname -s)

### 方法简要说明：
### 1. 是先查找一个字符串：带双引号的key。如果没找到，则直接返回defaultValue。
### 2. 查找最近的冒号，找到后认为值的部分开始了，直到在层数上等于0时找到这3个字符：,}]。
### 3. 如果有多个同名key，则依次全部打印（不论层级，只按出现顺序）
### @author lux feary
###
### 3 params: json, key, defaultValue
function getJsonValuesByAwk() {
    awk -v json="$1" -v key="$2" -v defaultValue="$3" 'BEGIN{
        foundKeyCount = 0
        while (length(json) > 0) {
            # pos = index(json, "\""key"\""); ## 这行更快一些，但是如果有value是字符串，且刚好与要查找的key相同，会被误认为是key而导致值获取错误
            pos = match(json, "\""key"\"[ \\t]*?:[ \\t]*");
            if (pos == 0) {if (foundKeyCount == 0) {print defaultValue;} exit 0;}
 
            ++foundKeyCount;
            start = 0; stop = 0; layer = 0;
            for (i = pos + length(key) + 1; i <= length(json); ++i) {
                lastChar = substr(json, i - 1, 1)
                currChar = substr(json, i, 1)
 
                if (start <= 0) {
                    if (lastChar == ":") {
                        start = currChar == " " ? i + 1: i;
                        if (currChar == "{" || currChar == "[") {
                            layer = 1;
                        }
                    }
                } else {
                    if (currChar == "{" || currChar == "[") {
                        ++layer;
                    }
                    if (currChar == "}" || currChar == "]") {
                        --layer;
                    }
                    if ((currChar == "," || currChar == "}" || currChar == "]") && layer <= 0) {
                        stop = currChar == "," ? i : i + 1 + layer;
                        break;
                    }
                }
            }
 
            if (start <= 0 || stop <= 0 || start > length(json) || stop > length(json) || start >= stop) {
                if (foundKeyCount == 0) {print defaultValue;} exit 0;
            } else {
                print substr(json, start, stop - start);
            }
 
            json = substr(json, stop + 1, length(json) - stop)
        }
    }'
}

function login() {
    echo "获取token中..."
    local response=$(
        curl "$baseUrl/km/sso/doLogin" \
            -H 'Accept: application/json, text/plain, */*' \
            -H 'Accept-Language: zh-CN,zh;q=0.9' \
            -H 'Connection: keep-alive' \
            -H 'Content-Type: application/json' \
            -H 'Cookie: MssSsoToken="lMNREmNV6V8q8oBisO3enQ=="' \
            -H 'DNT: 1' \
            -H 'Sec-Fetch-Dest: empty' \
            -H 'Sec-Fetch-Mode: cors' \
            -H 'Sec-Fetch-Site: same-origin' \
            -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36' \
            -H 'componentPath: /login' \
            -H 'current-dept: null' \
            -H 'isJwt: true' \
            -H 'sec-ch-ua: "Chromium";v="129", "Not=A?Brand";v="8"' \
            -H 'sec-ch-ua-mobile: ?0' \
            -H 'sec-ch-ua-platform: "macOS"' \
            -H 'showsSpinner: false' \
            --data-raw '{"username":"18085020423","password":"Gcia0UrLoh74bzxtaW9intOTK9uR/aW+HNeEiIaMRkLL+JRaADBdCwUPpPi3jErifO51psCTqMKv+w3pSB+gkuDdU2ScxojaTj2RNVT0/XwvpjcQVHxsnjyDhg5ktZEjNczdlvOLBR1WrjTxjf4o/u2DX2MDzmiBVbaxcedV03n7dUxSUNYBfHeV9991XtTdn/XE5W68xWu05HYUeW08G9W6vOWsUuqJku0hb8eRqfiUnWo+YCp3SbjGGj/0GB0XBl9HYklk6CALKQCLC2nvFQeVapyrP/DIW4Cl9mnmVlD3kqiIrE1yEPqX+tYjPVaXDhz50gAHp8y2sMnImMownw==","captchaCode":"V1EUmsX4wnmTpyWnuvCjVT2j7cxrjX4L45nVQF3Pvp1CDVE+j4Tl5W0vDDESxr5mvOUFOi5bsnG/XBFrDPMVUxX50JLH2boJX8lWtdHJarDJbDxNHFsl0GICCfbNkDP/wO9YHPYE2Pnip6Z+8Me/bxc0lWkDRaJcc8TFwthswPaOVAYz2Cny59SevkpcnSW3MYdpgIDomvapwc8F9VwxkeOpQtFJYuwCjBexEZIYXvpMmLmU+zcjHG7WBNpcM5CxW8mZYf1mJlGUmIYY+KQ10WEpW1xo1troAkcVnzonAFYAKNd6QhpPIx2OYPM70arSsrC3p/KxO0VJooFZOJZ0sQ==","clientType":"chrome","sysInfo":"Macintosh; Intel Mac OS X 10_15_7"}'
    )

    local responseData=$(getJsonValuesByAwk "$response" "data")

    local token=$(getJsonValuesByAwk "$responseData" "token")

    local mainDept=$(getJsonValuesByAwk "$responseData" "mainDept")

    local currentDept=$(getJsonValuesByAwk "$mainDept" "id")

    case "$OS" in
    CYGWIN* | MINGW32* | MSYS* | MINGW*)
        # 在Windows系统中
        echo "$(echo $token | tr -d '"')" >$infoName
        echo "$(echo $currentDept | tr -d '"')" >>$infoName
        ;;
    *)
        # 在Unix-like系统中
        echo "$(echo $token | tr -d '"')\n$(echo $currentDept | tr -d '"')" >$infoName
        ;;
    esac

    echo "-----------写入[$infoName]完成-----------"
}

function getToken() {
    echo $(head $1 $infoName | tail -n1)
}

function start() {
    echo "-----------开始获取菜单-----------"
    local result=$(
        curl "$baseUrl/forum/setting/topicSetting/selectPageByType" \
            -H 'Content-Type: application/json' \
            -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36' \
            -H "XT-Token:$(getToken -1)" \
            -H "current-dept:$(getToken -2)" \
            --data-raw '{"type":"2","keyword":"","pageIndex":1,"pageSize":10,"tenantId":"1","themeId":"1790278899577196546","auditState":0}' \
            --insecure
    )

    local code=$(getJsonValuesByAwk "$result" "code")
    local msg=$(getJsonValuesByAwk "$result" "msg")

    if [ "\"200\"" == "$code" ]; then
        local records=$(getJsonValuesByAwk "$result" "id")
        local newId="$(echo $records head -n 1 | awk '{print substr($0, 2, 19)}')"
        getDetail $newId
    else
        echo "$(echo $msg | tr -d '"')"
        login
        start
    fi

}

function getDetail() {
    local id=$1
    echo $id
    local response=$(
        curl "$baseUrl/forum/setting/topicSetting/get" \
            -H 'Accept: application/json, text/plain, */*' \
            -H 'Accept-Language: zh-CN,zh;q=0.9' \
            -H 'Connection: keep-alive' \
            -H 'Content-Type: application/json' \
            -H 'Sec-Fetch-Dest: empty' \
            -H 'Sec-Fetch-Mode: cors' \
            -H 'Sec-Fetch-Site: same-origin' \
            -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36' \
            -H 'componentPath: /forum_forum-area' \
            -H 'isJwt: true' \
            -H 'sec-ch-ua: "Chromium";v="129", "Not=A?Brand";v="8"' \
            -H 'sec-ch-ua-mobile: ?0' \
            -H 'sec-ch-ua-platform: "macOS"' \
            -H 'showsSpinner: true' \
            -H "XT-Token:$(getToken -1)" \
            -H "current-dept:$(getToken -2)" \
            --data-raw '{"id":'$id'}'
    )
    local topicContent=$(getJsonValuesByAwk "$response" "topicContent")

    echo $(echo $topicContent | tr -d '"') >$menuFile
    echo "-----------获取成功：[$menuFile]-----------"
    case "$OS" in
    CYGWIN* | MINGW32* | MSYS* | MINGW*)
        # 在Windows系统中
        explorer $menuFile
        ;;
    *)
        # 在Unix-like系统中
        open $menuFile
        ;;
    esac

}

if [ -s $infoName ]; then
    start
else
    login
    start
fi

```

