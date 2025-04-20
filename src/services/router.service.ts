import { loginPageGuard } from "@/guards/login-page.guard";
import { mainPageGuard } from "@/guards/main-page.guard";
import { Guard } from "@/models/guard.model";
import { AboutUsComponent } from "@/pages/about-us/about-us.component";
import { ErrorPage } from "@/pages/error-page/error-page.component";
import { LoginComponent } from "@/pages/login/login.component";
import { MainComponent } from "@/pages/main-page/main.component";
import { Component } from "@/utils/component";

export type Route = {
  component?: () => Component | Promise<Component>;
  redirectTo?: string
  guards?: Guard[];
};

type Routes = Record<string, Route>;

const routes: Routes = {
  "/": {
    redirectTo: "/login",
  },
  "/login": {
    component: () => new LoginComponent(),
    guards: [loginPageGuard],
  },
  "/main": {
    component: () => new MainComponent(),
    guards: [mainPageGuard],
  },
  "/about-us": {
    component: () => new AboutUsComponent(),
  },
  "/404": {
    component: () => new ErrorPage(),
  },
};


export class RouterService {
  private routes: Routes;
  private appRoot?: HTMLElement;
  private currentComponent: Component | null = null;

  constructor(routes: Routes) {
    this.routes = routes;
  }

  public async navigate(path: string): Promise<void> {
    const route = this.routes[path] || this.routes["/404"];
    if (!route) return;

    if (route.redirectTo) {
      await this.navigate(route.redirectTo);
      return;
    }

    if (route.guards && route.guards.length > 0) {
      for (const guard of route.guards) {
        const result = await guard();

        if (result === false) {
          return;
        }

        if (typeof result === "string") {
          await this.navigate(result);
          return;
        }
      }
    }
    history.pushState(null, "", path);
    await this.renderRoute();
  }

  public init(root: HTMLElement): void {
    window.addEventListener("popstate", () => this.renderRoute());
    this.appRoot = root;
    this.navigate(window.location.pathname)
  }

  private async renderRoute(): Promise<void> {
    const path = window.location.pathname;
    const route = this.routes[path] || this.routes["/404"];

    if (route.component) {
      if (this.currentComponent) {
        this.currentComponent.remove();
        this.currentComponent = null;
      }

      const component = await route.component();
      this.currentComponent = component;
      this.appRoot?.appendChild(component.getNode());
    }
  }
}

export const routerService = new RouterService(routes);
