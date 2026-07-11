import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Register",
  description: "Create a new Buddy Script account.",
};

export default function RegisterPage() {
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
            fill
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
              src="/assets/images/registration.png"
              alt="Registration illustration"
              width={856}
              height={631}
              priority
              className="h-auto w-full dark:hidden"
            />
            <Image
              src="/assets/images/registration1.png"
              alt="Registration illustration"
              width={856}
              height={631}
              priority
              className="hidden h-auto w-full dark:block"
            />
          </div>

          {/* Right – form card */}
          <div className="w-full px-2">
            <div className="bg-card rounded-lg p-12 shadow-none">
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
                Get Started Now
              </p>
              <h1 className="text-bs-color2 mb-[50px] text-center text-[28px] leading-tight font-medium">
                Registration
              </h1>

              {/* Google register */}
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
                Register with google
              </Button>

              {/* OR divider */}
              <div className="relative mb-10 flex items-center justify-center py-[11px]">
                <span className="bg-bs-bg4 absolute left-0 h-px w-[108px]" />
                <span className="text-bs-color3 text-sm font-normal">Or</span>
                <span className="bg-bs-bg4 absolute right-0 h-px w-[108px]" />
              </div>

              {/* Registration form */}
              <RegisterForm />

              {/* Login link */}
              <p className="text-bs-color text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Login Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
