"use server"

import prisma from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type UserProps = {
  Name: string;
  Age: number;
  City: string;
  userId: string;
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
}

export async function createUsers(data: UserProps) {
  const { userId } = auth();

  if(!userId) {
    return null;
  }
  try {
    const user = await prisma.user.create({
      data: {
        name: data.Name,
        age: data.Age,
        city: data.City,
        userId: userId
      }
    });
    revalidatePath("/users")
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function createBulkUsers(users: UserProps[]) {
  const { userId } = auth();

  if(!userId) {
    return null;
  }

  try {
    const formattedUsers = users.map(user => ({
      name: user.Name,
      age: user.Age,
      city: user.City,
      userId: userId      
    }));

    await prisma.user.createMany({
      data: formattedUsers,
    });

    revalidatePath("/users")
  } catch (error) {
    console.error("Error creating bulk users:", error);
    throw error;
  }
}
