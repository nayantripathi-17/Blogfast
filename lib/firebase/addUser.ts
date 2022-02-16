import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { UserObject } from "../../types";
import { initDB } from "./initDB";

//Add A User
export const addUser = async (subId: string | undefined, options: UserObject) => {
  if (subId === undefined) {
    return;
  }
  const db = await initDB();
  try {
    const userObj = {
      ...options,
      timestamp: serverTimestamp(),
    };

    /*Get Document Reference in users
    to Edit or Create user */
    const userRef = doc(db, "users", subId);
    await setDoc(userRef, userObj, { merge: true });
    return;
  } catch (err) {
    //catch
    console.log(err, "addUser");
    throw err;
  }
};
