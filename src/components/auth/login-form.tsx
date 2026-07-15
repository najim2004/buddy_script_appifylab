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
import { useLoginMutation } from "@/features/auth";
import { getApiErrorMessage } from "@/lib/api/error";
import { ROUTES } from "@/lib/constants";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  remember: z.boolean(),
});

interface LoginFormProps {
  redirectTo?: string;
}

function safeRedirectPath(path?: string): string {
  if (path && path.startsWith("/") && !path.startsWith("//")) return path;
  return ROUTES.HOME;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await login({ email: values.email, password: values.password }).unwrap();
      toast.success("Welcome back!");
      router.replace(safeRedirectPath(redirectTo));
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Invalid email or password"));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[14px]">
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
                  className="bg-card border-input placeholder:text-placeholder h-12 rounded-md text-sm shadow-none focus-visible:ring-0"
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
                  autoComplete="current-password"
                  className="bg-card border-input placeholder:text-placeholder h-12 rounded-md text-sm shadow-none focus-visible:ring-0"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between pt-1">
          <FormField
            control={form.control}
            name="remember"
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
                    Remember me
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <button
            type="button"
            className="text-primary text-sm hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <div className="pt-[26px] pb-[60px]">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-auto w-full rounded-md py-3 text-base font-medium hover:shadow-[0_8px_24px_rgba(24,144,255,0.25)]"
          >
            {isLoading ? "Signing in…" : "Login now"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
