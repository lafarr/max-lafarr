import 'next-auth';

declare module 'next-auth' {
  type Session = {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}
