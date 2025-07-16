import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      userId: string;
      username: string;
      displayName?: string;
    };
  }
}