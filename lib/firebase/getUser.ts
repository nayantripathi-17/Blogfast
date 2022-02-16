import { doc, getDoc } from "firebase/firestore";
import { GetUserOptions, UserObject } from "../../types";
import { initDB } from "./initDB";

//Get User in database
export const getUser = async ({ subId, userRef }: GetUserOptions) => {
  const db = await initDB();
  try {
    //Not provided userRef or subId
    if (subId === undefined && userRef === undefined) {
      return {
        isUserExisting: false,
      };
    }
    //Get reference to collection
    const user = await getDoc(subId ? doc(db, "users", subId) : doc(db, String(userRef)));

    //If exists, return Data and True
    if (user.exists()) {
      return {
        user: {
          ...user.data() as UserObject,
        },
        isUserExisting: true,
      };
    }
    //Else return False
    else {
      return {
        isUserExisting: false,
      };
    }
  } catch (err) {
    //catch
    console.log(err, "newUser");
    return {
      isUserExisting: false,
    };
  }
};
