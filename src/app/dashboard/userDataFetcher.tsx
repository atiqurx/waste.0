// src/app/dashboard/UserDataFetcher.tsx

import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoose";
import Business from "@/lib/models/business.model";
import Charity from "@/lib/models/charity.model";

export async function fetchUserData() {
  const user = await currentUser();
  if (!user) return null;

  const userEmail = user?.emailAddresses[0]?.emailAddress;

  await connectToDB();
  const business = await Business.findOne({ email: userEmail });
  const charity = await Charity.findOne({ email: userEmail });

  let allBusinesses = null;
  if (charity) {
    allBusinesses = await Business.find();
  }

  return { userData: business || charity || null, isCharity: !!charity, allBusinesses };
}
