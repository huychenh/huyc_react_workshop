import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../components/input";
import CheckBox from "../components/checkbox";
import Button from "../components/button";
import type { SignUpForm } from "../types/signup-form";

const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpForm>();

  const onSubmit = async (data: SignUpForm) => {
    console.log("Sign up data: ", data);

    try {
      const response = await fetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();
      console.log("Signup API result:", result);

      if (!response.ok) {
        alert("Signup failed: " + (result.message || "Unknown error"));
        return;
      }

      alert("Signup success! (Note: DummyJSON does NOT save user permanently)");
      navigate("/auth/login");
    } catch (error) {
      console.error(error);
      alert("Network error during signup");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 shadow-md rounded-xl bg-white">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Create a Free Account
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username */}
        <div>
          <label className="block font-medium mb-1">Your username</label>
          <Input
            required
            placeholder="Enter your username"
            error={errors.username?.message}
            {...register("username", {
              required: "Username is required",
            })}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium mb-1">Your password</label>
          <Input
            placeholder="•••••••"
            type="password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
        </div>

        {/* Confirm password */}
        <div>
          <label className="block font-medium mb-1">Confirm password</label>
          <Input
            placeholder="•••••••"
            type="password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
        </div>

        {/* Accept terms */}
        <div className="flex items-center space-x-2">
          <CheckBox label="" {...register("accept", { required: true })} />
          <p className="text-sm">
            I accept the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms and Conditions
            </a>
          </p>
        </div>
        {errors.accept && (
          <p className="text-red-600 text-sm">You must accept the terms</p>
        )}

        {/* Submit button */}
        <Button>Create account</Button>
      </form>

      <p className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <span
          className="text-blue-600 hover:underline cursor-pointer"
          onClick={() => navigate("/auth/login")}
        >
          Login here
        </span>
      </p>
    </div>
  );
};

export default SignUp;
