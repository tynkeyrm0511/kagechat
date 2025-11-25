import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const signUpSchema = z
  .object({
    firstname: z.string().min(1, "Vui lòng nhập tên"),
    lastname: z.string().min(1, "Vui lòng nhập họ"),
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    email: z.email("Email không hợp lệ"),
    password: z.string().min(7, "Mật khẩu phải có ít nhất 7 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {signUp} = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data:SignUpFormValues) => {
    const {firstname, lastname, username, email, password} = data;
    //Goi api
    await signUp(username, password, email, lastname, firstname);
    navigate("/signin");
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* LEFT */}
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a
                  href="/"
                  className="mx-auto w-fit text-center flex flex-row gap-2 items-center"
                >
                  <img className="w-16" src="/logo.png" alt="kagelogo" />
                  <h1 className="text-2xl font-bold text-primary">Kage Chat</h1>
                </a>
                <h1 className="font-bold text-xl">Đăng ký</h1>
                <p className="text-muted-foreground text-balance">
                  Chào mừng bạn! Hãy đăng ký tài khoản để bắt đầu!
                </p>
              </div>
              {/* Họ và tên */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-sm block">
                    Họ
                  </Label>
                  <Input type="text" id="lastename" {...register("lastname")}/>
                  {errors.lastname && (
                    <p className="text-destructive text-sm">
                      {errors.lastname.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-sm block">
                    Tên
                  </Label>
                  <Input type="text" id="firstname" {...register("firstname")} />
                  {errors.firstname && (
                    <p className="text-destructive text-sm">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Username */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-sm block">
                  Tên đăng nhập
                </Label>
                <Input type="text" id="username" placeholder="kagechat" {...register("username")} />
                {errors.username && (
                  <p className="text-destructive text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>
              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm block">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="kagechat@gmail.com"
                  {...register("email")}
                />
                {errors.email&&(
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              {/* Password */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm block">
                    Mật khẩu
                  </Label>
                  <Input type="password" id="password" {...register("password")} />
                  {errors.password&&(
                    <p className="text-destructive text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-confirm" className="text-sm block">
                    Nhập lại mật khẩu
                  </Label>
                  <Input type="password" id="password-confirm" {...register("confirmPassword")} />
                  {errors.confirmPassword&&(
                    <p className="text-destructive text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Nút đăng ký */}
              <Button className="w-full hover:cursor-pointer" disabled={isSubmitting}>
                Tạo tài khoản
              </Button>
              <div className="text-center text-sm">
                Đã có tài khoản?{" "}
                <a href="/signin" className="underline underline-offset-4">
                  Đăng nhập
                </a>
              </div>
            </div>
          </form>
          {/* RIGHT */}
          <div className="bg-primary relative hidden md:block">
            <img
              src="/sign_up.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-balance">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </FieldDescription>
    </div>
  );
}
