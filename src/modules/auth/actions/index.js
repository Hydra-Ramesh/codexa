"use server";
import db from "../../../lib/db.js";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUser = async () => {
    try{
        const user = await currentUser();   
        if(!user){
            return {
                success: false,
                error: "No Authenticated User Found"
            }
        }
        const {id, emailAddresses, firstName, lastName, imageUrl} = user;
        const newUser = await db.user.upsert({
            where: {
                clerkId: id
            },
            update: {
                name :
                    firstName && lastName 
                    ? `${firstName} ${lastName}` 
                    : firstName || lastName || null, 
                image: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || "",
            },
            create: {
                clerkId: id,
                name :
                    firstName && lastName 
                    ? `${firstName} ${lastName}` 
                    : firstName || lastName || null, 
                image: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || "",
            },
        });
        return {
            success: true,
            user: newUser,
            message: "User Onboarded Successfully"
        }
    }catch(err){
        console.log("Error Onboarding User: ", err);
        return {
            success: false,
            error: "Error Onboarding User"
        }
    }
}

export const getCurrentUser = async () => {
    try{
        const user = await currentUser();
        if(!user){
            return null;
        }
        const dbUser = await db.user.findUnique({
            where: {
                clerkId: user.id
            },
            select: {
                id: true,
                email: true,
                name: true,
                image: true,
                clerkId: true,
            }
        });
        return dbUser;
    }catch(err){
        console.log("Error Fetching Current User: ", err);
        return null;
    }
}