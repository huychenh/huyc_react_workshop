import { Link, useNavigate } from "react-router-dom";
import type { LoginForm } from "../types/login-form";
import { TOKEN } from "../constant/auth";
import { ADMIN_URL, AUTH_URL } from "../constant/url";
import Input from "../components/input";
import CheckBox from "../components/checkbox";
import Button from "../components/button";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../hooks/use-login-mutation";

const Login = () => {
  const navigate = useNavigate();

  const rememberedUsername = localStorage.getItem("rememberedUsername") || "";
  const rememberedPassword = localStorage.getItem("rememberedPassword") || "";

  const { handleSubmit, register, formState: { errors }, watch } = useForm<LoginForm>({
    defaultValues: {
      username: rememberedUsername,
      password: rememberedPassword,
      remember: !!rememberedUsername && !!rememberedPassword,
    },
  });

  const { mutateAsync: login, isPending, error, reset } = useLoginMutation();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await login({
        username: data.username,
        password: data.password,
      });

      const { accessToken } = response.data;
      localStorage.setItem(TOKEN, accessToken);

      //Handle remember checkbox  
      if (data.remember) {
        localStorage.setItem("rememberedUsername", data.username);
        localStorage.setItem("rememberedPassword", data.password);
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
      }

      return navigate(ADMIN_URL.DASHBOARD);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  watch(() => {
    if (error?.message) reset();
  });

  return (
    <>
      <form className="mt-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <Input
            label="Username: emilys"
            required
            placeholder="Enter your username"
            error={errors.username?.message}
            {...register("username", {
              required: "Username is required",
            })}
          />
        </div>
        <div className="mb-4">
          <Input
            label="Password: emilyspass"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
            })}
          />
        </div>
        <div className="my-4">
          <CheckBox label="Remember me" {...register("remember")} />
        </div>
        {error?.message && (
          <small className="text-red-600 my-4 block">{error.message}</small>
        )}
        <Button isLoading={isPending} disabled={isPending}>
          Login
        </Button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        Don't have an account?
        <Link
          to={AUTH_URL.SIGNUP}
          className="ml-2 text-blue-600 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </>
  );
};

export default Login;
