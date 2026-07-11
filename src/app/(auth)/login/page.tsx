import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login",
  description: "Login to your Buddy Script account.",
};

export default function LoginPage() {
  return (
    <main className="bg-background relative min-h-screen max-w-screen overflow-x-hidden py-[100px]">
      {/* Background decorative shapes */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <span className="absolute top-0 left-0 h-[540px] w-[176px]">
          <Image
            src="/assets/images/shape1.svg"
            alt=""
            fill
            priority
            className="dark:hidden"
          />
          <Image
            src="/assets/images/dark_shape.svg"
            alt=""
            fill
            priority
            className="hidden dark:block"
          />
        </span>
        <span className="absolute top-0 right-5 h-[400px] w-[568px]">
          <Image
            src="/assets/images/shape2.svg"
            alt=""
            fill
            className="dark:hidden"
          />
          <Image
            src="/assets/images/dark_shape1.svg"
            alt=""
            fill
            className="hidden dark:block"
          />
        </span>
        <span className="absolute right-[327px] bottom-0 h-[548px] w-[568px]">
          <Image
            src="/assets/images/shape3.svg"
            alt=""
            fill
            className="dark:hidden"
          />
          <Image
            src="/assets/images/dark_shape2.svg"
            alt=""
            width={280}
            height={280}
            className="hidden dark:block"
          />
        </span>
      </div>

      {/* Page content */}
      <div className="relative container mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Left – illustration */}
          <div className="my-auto w-full px-2 lg:col-span-2">
            <Image
              src="/assets/images/login.png"
              alt="Login illustration"
              width={633}
              height={480}
              priority
              className="h-auto w-full max-w-[633px]"
            />
          </div>

          {/* Right – form card */}
          <div className="w-full px-2">
            <div className="bg-card rounded-md p-12 shadow-sm">
              {/* Logo */}
              <div className="mb-7 flex justify-center">
                <Image
                  src="/assets/images/logo.svg"
                  alt="Buddy Script logo"
                  width={161}
                  height={40}
                  className="h-auto w-auto max-w-[161px]"
                />
              </div>

              {/* Heading */}
              <p className="text-bs-color mb-2 text-center text-base leading-snug font-normal">
                Welcome back
              </p>
              <h1 className="text-bs-color2 mb-[50px] text-center text-[28px] leading-tight font-medium">
                Login to your account
              </h1>

              {/* Google sign-in */}
              <Button
                type="button"
                variant="outline"
                className="bg-card hover:bg-muted border-bs-bcolor1 text-bs-color2 mb-10 h-auto w-full justify-center gap-2 rounded-lg px-[60px] py-3 text-base font-medium shadow-none"
              >
                <Image
                  src="/assets/images/google.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                Or sign-in with google
              </Button>

              {/* OR divider */}
              <div className="relative mb-10 flex items-center justify-center py-[11px]">
                <span className="bg-bs-bg4 absolute left-0 h-px w-[108px]" />
                <span className="text-bs-color3 text-sm font-normal">Or</span>
                <span className="bg-bs-bg4 absolute right-0 h-px w-[108px]" />
              </div>

              {/* Login form */}
              <LoginForm />

              {/* Register link */}
              <p className="text-bs-color text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary font-medium hover:underline"
                >
                  Create New Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
