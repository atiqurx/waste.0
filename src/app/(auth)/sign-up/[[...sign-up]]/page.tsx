import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-r from-green-100 via-yellow-50 to-orange-100">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section: Logo and Welcome Message */}
        <div className="flex flex-col justify-center items-start p-8">
          <Image
            src="/assets/logo.png" // Replace with the path to your logo
            alt="waste.0 Logo"
            width={150}
            height={150}
            className="mb-8"
          />
          <h1 className="text-5xl font-bold text-green-800 mb-4">Welcome to waste.0</h1>
          <p className="text-lg text-gray-700">
            Optimize grocery orders and reduce food waste with the power of AI. Donate surplus food to local charities before it expires, and help make the world a better place.
          </p>
        </div>

        {/* Right Section: Sign In Form */}
        <div className="rounded-lg p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-semibold text-orange-600 mb-6 text-center">Sign Up</h2>
            <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" forceRedirectUrl="/onboarding" />
            <p className="mt-6 text-sm text-center text-gray-500">
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-green-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-green-600 hover:underline">
                Privacy Policy
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
