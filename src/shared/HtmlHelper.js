export default class HtmlHelper {
    static injectBaseUrl(htmlContent, resourceUrl) {
        let baseUrl;
        const url = new URL(resourceUrl);
        if (url.pathname) {
            const lastIndex = url.pathname.lastIndexOf("/");
            const basePath = lastIndex > 0 ? url.pathname.slice(0, lastIndex) : url.pathname;
            baseUrl = `${url.protocol}//${url.host}${basePath}${basePath.endsWith("/") ? "" : "/"}`;
        } else {
            baseUrl = `${url.protocol}//${url.host}/`;
        }
        return htmlContent.replace("<head>", `<head>\r\n<base href="${baseUrl}" />`);
    }
}
