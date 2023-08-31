import { renderToHTMLOrFlight } from "../../../app-render/app-render";
import { RouteModule } from "../route-module";
export class AppPageRouteModule extends RouteModule {
    handle() {
        throw new Error("Method not implemented.");
    }
    render(req, res, context) {
        return renderToHTMLOrFlight(req, res, context.page, context.query, context.renderOpts);
    }
}
export default AppPageRouteModule;

//# sourceMappingURL=module.js.map