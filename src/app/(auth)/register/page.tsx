import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const metadata = {
  title: "Register",
  description: "Create a new Buddy Script account.",
};

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen bg-background py-[100px]">
      {/* Background decorative shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute left-0 top-0">
          <Image src="/assets/images/shape1.svg" alt="" width={450} height={450} priority className="dark:hidden" />
          <Image src="/assets/images/dark_shape.svg" alt="" width={450} height={450} priority className="hidden dark:block" />
        </span>
        <span className="absolute right-5 top-0">
          <Image src="/assets/images/shape2.svg" alt="" width={360} height={360} className="dark:hidden" />
          <Image src="/assets/images/dark_shape1.svg" alt="" width={360} height={360} className="hidden dark:block" />
        </span>
        <span className="absolute bottom-0 right-[327px]">
          <Image src="/assets/images/shape3.svg" alt="" width={280} height={280} className="dark:hidden" />
          <Image src="/assets/images/dark_shape2.svg" alt="" width={280} height={280} className="hidden dark:block" />
        </span>
      </div>

      {/* Page content */}
      <div className="container relative mx-auto max-w-[1320px] px-4">
        <div className="flex flex-wrap items-center gap-y-10 lg:flex-nowrap">

          {/* Left – illustration */}
          <div className="w-full lg:w-2/3 lg:pr-8">
            <Image
              src="/assets/images/registration.png"
              alt="Registration illustration"
              width={633}
              height={480}
              priority
              className="h-auto w-full max-w-[633px] dark:hidden"
            />
            <Image
              src="/assets/images/registration1.png"
              alt="Registration illustration"
              width={633}
              height={480}
              priority
              className="hidden h-auto w-full max-w-[633px] dark:block"
            />
          </div>

          {/* Right – form card */}
          <div className="w-full lg:w-1/3">
            <div className="rounded-md bg-card p-12 shadow-sm">

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
              <p className="mb-2 text-center text-base leading-snug font-normal text-bs-color">
                Get Started Now
              </p>
              <h1 className="mb-[50px] text-center text-[28px] leading-tight font-medium text-bs-color2">
                Registration
              </h1>

              {/* Google register */}
              <Button
                type="button"
                variant="outline"
                className="bg-card hover:bg-muted mb-10 h-auto w-full justify-center gap-2 rounded-md border-bs-bcolor1 px-[60px] py-3 text-base font-medium text-bs-color2"
              >
                <Image src="/assets/images/google.svg" alt="" width={20} height={20} className="shrink-0" />
                Register with google
              </Button>

              {/* OR divider */}
              <div className="relative mb-10 flex items-center justify-center py-[11px]">
                <span className="absolute left-0 h-px w-[108px] bg-bs-bg4" />
                <span className="text-sm font-normal text-bs-color3">
                  Or
                </span>
                <span className="absolute right-0 h-px w-[108px] bg-bs-bg4" />
              </div>

              {/* Registration form */}
              <form className="space-y-[14px]" noValidate>
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="reg-email"
                    className="text-base font-medium text-bs-color4"
                  >
                    Email
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    className="bg-card focus-visible:ring-primary h-12 rounded-md border-bs-bcolor2 text-sm placeholder:text-bs-color3"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="reg-password"
                    className="text-base font-medium text-bs-color4"
                  >
                    Password
                  </Label>
                  <Input
                    id="reg-password"
                    type="password"
                    autoComplete="new-password"
                    className="bg-card focus-visible:ring-primary h-12 rounded-md border-bs-bcolor2 text-sm placeholder:text-bs-color3"
                    placeholder="••••••••"
                  />
                </div>

                {/* Repeat Password */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="reg-confirm"
                    className="text-base font-medium text-bs-color4"
                  >
                    Repeat Password
                  </Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    autoComplete="new-password"
                    className="bg-card focus-visible:ring-primary h-12 rounded-md border-bs-bcolor2 text-sm placeholder:text-bs-color3"
                    placeholder="••••••••"
                  />
                </div>

                {/* Terms checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="terms"
                    defaultChecked
                    className="border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor="terms"
                    className="cursor-pointer text-sm font-normal text-bs-color"
                  >
                    I agree to terms &amp; conditions
                  </Label>
                </div>

                {/* Submit */}
                <div className="pt-[26px] pb-[60px]">
                  <Button
                    type="submit"
                    className="h-auto w-full rounded-md bg-primary py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 hover:shadow-[0_8px_24px_rgba(24,144,255,0.25)]"
                  >
                    Register now
                  </Button>
                </div>
              </form>

              {/* Login link */}
              <p className="text-center text-sm text-bs-color">
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
