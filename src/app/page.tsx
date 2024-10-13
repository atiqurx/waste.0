import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-green-900 shadow-sm w-full px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">wase.0</div>
        <SignedOut>
          <SignInButton>
            <button className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow bg-gradient-to-r from-orange-200 via-yellow-100 to-green-200 text-center px-4 py-16">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-green-800">
          Reduce Food Waste with <span className="text-orange-600">wase.0</span>
        </h1>
        <p className="text-lg text-gray-700 mt-6 max-w-2xl">
          Connect your grocery shop inventory with our AI to predict daily orders and avoid surplus food waste. Notify charities about soon-to-expire food to donate before it gets wasted.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gradient-to-r from-orange-200 via-yellow-100 to-green-200 text-center">
        <h2 className="text-3xl font-bold text-green-800">How it Works</h2>
        <div className="mt-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="bg-green-50 p-8 rounded-lg shadow-md">
            <Image
              src="/images/ai-model.svg"
              alt="AI Model"
              width={64}
              height={64}
              className="mx-auto"
            />
            <h3 className="text-xl font-semibold mt-4 text-green-700">
              AI-Powered Inventory Management
            </h3>
            <p className="text-gray-700 mt-2">
              Our machine learning models analyze your grocery store's inventory to suggest optimized daily orders.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-green-50 p-8 rounded-lg shadow-md">
            <Image
              src="/images/expiration-notification.svg"
              alt="Expiration Alerts"
              width={64}
              height={64}
              className="mx-auto"
            />
            <h3 className="text-xl font-semibold mt-4 text-green-700">
              Expiration Alerts
            </h3>
            <p className="text-gray-700 mt-2">
              Receive real-time alerts when items are nearing their expiration date so you can avoid waste by donating them.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-green-50 p-8 rounded-lg shadow-md">
            <Image
              src="/images/charity-donation.svg"
              alt="Charity Connection"
              width={64}
              height={64}
              className="mx-auto"
            />
            <h3 className="text-xl font-semibold mt-4 text-green-700">
              Charity Connection
            </h3>
            <p className="text-gray-700 mt-2">
              Automatically notify local charities to collect near-expiration food for donation, reducing waste and helping those in need.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gradient-to-r from-orange-200 via-yellow-100 to-green-200 text-center">
        <h2 className="text-3xl font-bold text-green-800">About wase.0</h2>
        <p className="mt-6 max-w-4xl mx-auto text-lg text-gray-700">
          wase.0 is dedicated to tackling the growing problem of food waste by connecting grocery stores with charities. By leveraging AI, our platform ensures grocery stores can optimize their daily orders to minimize excess and help charities receive food before it goes to waste.
        </p>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-green-900 text-white text-center py-8">
        <div className="max-w-4xl mx-auto">
          <h4 className="text-xl font-semibold">Get in Touch</h4>
          <p className="mt-4 text-gray-300">contact@wase0.com</p>
          <p className="mt-2 text-gray-300">123 Food Street, Save City, SC 12345</p>
        </div>
      </footer>
    </div>
  );
}
