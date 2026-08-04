// // auth.d.ts

// export {}
// import { DefaultSession } from "next-auth";

// declare module "next-auth" {
//   interface User {
//     id: string;
//     phone: string;
//     apiToken: string;
//   }

//   interface Session {
//     user: {
//       id: string;
//       phone: string;
//       apiToken: string;
//     } & DefaultSession["user"];
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     phone: string;
//     apiToken: string;
//   }
// }
