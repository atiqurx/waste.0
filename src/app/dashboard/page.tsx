import React from 'react';
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoose";
import Business from "@/lib/models/business.model";
import Charity from "@/lib/models/charity.model";
import Image from 'next/image';

// Mock surplus data for now
const mockSurplusItems = [
  { id: 1, name: "Milk", quantity: 50, expirationDate: "2024-11-01" },
  { id: 2, name: "Bread", quantity: 100, expirationDate: "2024-10-15" },
  { id: 3, name: "Eggs", quantity: 200, expirationDate: "2024-10-20" }
];

// Fetch user data and determine if the user is a charity
async function fetchUserData(userEmail: string) {
  await connectToDB();

  const business = await Business.findOne({ email: userEmail });
  const charity = await Charity.findOne({ email: userEmail });
  
  // If the user is a charity, fetch all businesses
  let allBusinesses = null;
  if (charity) {
    allBusinesses = await Business.find(); // Get all businesses
  }

  // Return user data and all businesses (if user is a charity)
  return { userData: business || charity || null, isCharity: !!charity, allBusinesses };
}

// Main component rendering the Streamlit app and sidebar
async function StreamlitAppWithSidebar() {
  const user = await currentUser();
  if (!user) return null;

  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const profileImageUrl = '/assets/profile.jpg';

  // Fetch user data and check if the user is a charity
  const { userData, isCharity, allBusinesses } = await fetchUserData(userEmail);

  return (
    <div className="flex h-screen w-full">
      {/* Left Half: Sidebar and User/Business Info */}
      <div className="w-1/5 text-black p-6 overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 pb-2">User Information</h3>
        <div className="flex flex-col items-center">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt="User Profile Image"
              width={80}
              height={80}
              className="rounded-full mb-4"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-600 rounded-full mb-4" />
          )}
          <p className="text-lg font-semibold">{user?.fullName || "No Name"}</p>
          <p className="text-sm text-black">{userEmail}</p>
        </div>

        {/* Conditionally render business information if the user is a charity */}
        {isCharity && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Nearby Businesses</h4>
            <div className="space-y-4">
              {allBusinesses && allBusinesses.map((business: any) => (
                <div key={business._id} className="border border-orange-400 p-4 rounded-lg">
                  <p><strong>Username:</strong> {business.name}</p>
                  <p><strong>Email:</strong> {business.email}</p>
                  <p><strong>Phone Number:</strong> {business.phone || "N/A"}</p>
                  {/* Format the address properly */}
                  <p><strong>Address:</strong> {`${business.address.street}, ${business.address.city}, ${business.address.state}, ${business.address.zipCode}` || "N/A"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      Right Half: Streamlit App
      <div className="w-5/6">
        <iframe
          src="http://localhost:8501" // Replace with your Streamlit app URL
          className="w-full h-full border-none"
          title="Streamlit App"
        />
      </div>

      {/* Right Sidebar for Surplus List */}
      {/* <div className="w-1/4 text-black p-6 overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 pb-2">Surplus List</h3>
        <form>
          <ul className="space-y-4">
            {mockSurplusItems.map((item) => (
              <li key={item.id} className="bg-white p-4 rounded-lg">
                <p><strong>{item.name}</strong></p>
                <p>Quantity: {item.quantity}</p>
                <p>Expiration Date: {item.expirationDate}</p>
              </li>
            ))}
          </ul>
        </form>
      </div> */}
    </div>
  );
}

export default StreamlitAppWithSidebar;
