"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRegisterMutation } from "@/features/auth";
import { getApiErrorMessage } from "@/lib/api/error";
import { ROUTES } from "@/lib/constants";

const registerSchema = z
  .object({
    first_name: z.string().min(1, { message: "First name is required." }),
    last_name: z.string().min(1, { message: "Last name is required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms & conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const inputClass =
  "bg-card border-input placeholder:text-placeholder h-12 rounded-md text-sm shadow-none focus-visible:ring-0";

export function RegisterForm() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: true,
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await register({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
      }).unwrap();
      toast.success("Account created. Please sign in.");
      router.push(ROUTES.LOGIN);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not create account"));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[14px]">
        <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel className="text-label text-base font-medium">
                  First name
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="given-name"
                    className={inputClass}
                    placeholder="John"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel className="text-label text-base font-medium">
                  Last name
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="family-name"
                    className={inputClass}
                    placeholder="Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="text-label text-base font-medium">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="text-label text-base font-medium">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  className={inputClass}
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="text-label text-base font-medium">
                Repeat Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  className={inputClass}
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-1">
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                  />
                </FormControl>
                <div className="leading-none">
                  <FormLabel className="text-card-foreground cursor-pointer text-sm font-normal">
                    I agree to terms &amp; conditions
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          {form.formState.errors.terms && (
            <p className="text-destructive mt-2 text-sm font-medium">
              {form.formState.errors.terms.message}
            </p>
          )}
        </div>

        <div className="pt-[26px] pb-[60px]">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-auto w-full rounded-md py-3 text-base font-medium hover:shadow-[0_8px_24px_rgba(24,144,255,0.25)]"
          >
            {isLoading ? "Creating account…" : "Register now"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
