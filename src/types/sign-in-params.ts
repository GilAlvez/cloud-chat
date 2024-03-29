export type SignInParams =
  | {
      flow: "password";
      phoneNumber: string;
      password: string;
    }
  | {
      flow: "refreshToken";
      token: string;
    };
