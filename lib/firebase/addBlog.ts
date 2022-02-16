import { arrayUnion, collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { addBlogOptions } from "../../types";
import { initDB } from "./initDB";


//Add A Blog
export const addBlog = async (subId: string, city: string, options: addBlogOptions): Promise<string> => {
  const db = await initDB();
  try {
    const blogRefInCities = doc(collection(db, "cities", city, "blogs"));
    const blogRef = doc(db, "blogs", blogRefInCities.id);
    const cityRef = doc(db, "cities", city);
    const userRef = doc(db, "users", subId);
    /* Transaction to Add blog in blogs collection, 
      update User to contain reference to blog */
    await runTransaction(db, async (transaction) => {


      const blogObj = {
        ...options,
        subId: userRef,
        city,
        timestamp: serverTimestamp(),
      };

      //Checking if city mentioned in blog already in cities collection
      const cityResult = (await transaction.get(cityRef)).exists();
      //If False, adding the city
      if (!cityResult) {
        const cityOptions = {
          name: city,
        };
        transaction.set(cityRef, cityOptions);
      }

      /*Get blogPosted from User info, 
        Add and Update new Blog's Reference */
      transaction.set(blogRefInCities, blogObj);
      //Add Blog reference to Blog path
      transaction.set(blogRef, {
        blogRefInCities: blogRefInCities,
      });
      //Add Blog reference to User
      transaction.update(userRef, {
        blogsPosted: arrayUnion(blogRefInCities),
      });
    })
    return blogRefInCities.id;

  } catch (err) {
    //catch
    console.log(err, "addBlog");
    throw err;
  }
};
