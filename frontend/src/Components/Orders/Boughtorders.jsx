
// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import "./new_b.css"; // Add custom CSS for styling if needed

// // const BoughtOrders = () => {
// //   const [boughtItems, setBoughtItems] = useState([]);
// //   const [reviewData, setReviewData] = useState({}); // Store review data for each item
// //   const [loading, setLoading] = useState(true); // To handle loading state
// //   const [errorMessage, setErrorMessage] = useState(""); // To handle error messages

// //   // Temporary states to store user input before submitting the review
// //   const [tempRating, setTempRating] = useState(null);
// //   const [tempComment, setTempComment] = useState("");

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     // Fetch bought items
// //     if(!token){
// //       console.error("Unauthorized access. Redirecting to login...");
// //       return;
// //     }
// //     const fetchBoughtItems = async () => {
// //       try {
// //         const email = localStorage.getItem("userEmail"); // Retrieve user email from local storage
// //         if (!email || !token) {
// //           console.error("User email not found in local storage.");
// //           return;
// //         }

// //         const response = await axios.get(`http://localhost:5000/orders_bought/${email}`,{
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           }
// //         });
// //         if (response.data.success) {
// //           setBoughtItems(response.data.boughtItems || []);
// //           // Fetch reviews for each item bought
// //         // fetchReviews(response.data.boughtItems, email,token);
// //         } else {
// //           console.error("Failed to fetch bought items.");
// //         }

// //         // // Fetch reviews for each item bought
// //         await fetchReviews(response.data.boughtItems, email,token);
// //       } catch (error) {
// //         console.error("Error fetching bought items:", error);
// //       }
// //     };

// //     const fetchReviews = async (items, buyerEmail) => {
// //       try {
// //         const reviews = {};
// //         for (let item of items) {
// //           const response = await axios.get(
// //             `http://localhost:5000/reviews/${item._id}/${buyerEmail}/${item.seller._id}`,{
// //               headers: {
// //                 Authorization: `Bearer ${token}`,
// //               }
// //             }
// //           );
// //           // If review exists for the item, store it
// //           reviews[item._id] = response.data.review || null; // Store null if no review exists
// //         }
// //         setReviewData(reviews);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error("Error fetching reviews:", error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchBoughtItems();
// //   }, []);

// //   const handleStarClick = (itemId, rating) => {
// //     setTempRating(rating); // Store the rating in the temporary state
// //   };

// //   const handleSubmitReview = async (itemId) => {
// //     const buyerEmail = localStorage.getItem("userEmail");  // Retrieve email from localStorage
// //     const token = localStorage.getItem("token");
// //     const review = { rating: tempRating, comment: tempComment };

// //     // Validate that both rating and comment are provided
// //     if (!review.rating || !review.comment) {
// //       setErrorMessage("Please provide both rating and comment before submitting.");
// //       return;
// //     }

    
// //     if (!token || !buyerEmail) {
// //       console.error("Unauthorized. Please log in again.");
// //       setErrorMessage("Unauthorized. Please log in.");
// //       return;
// //     }

// //     try {
// //       // Send the review data to the backend with the email (not ObjectId)
// //       const response = await axios.post("http://localhost:5000/reviews", {
// //         sellerId: boughtItems.find((item) => item._id === itemId).seller._id,
// //         itemId: itemId,  // Include the itemId in the request body
// //         buyerEmail: buyerEmail, // Send email instead of ObjectId
// //         rating: review.rating,
// //         comment: review.comment,
// //       },{
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         }
// //       });

// //       if (response.data.success) {
// //         alert("Review submitted successfully!");
// //         // Refetch reviews after submitting
// //         const itemReviews = await axios.get(`http://localhost:5000/reviews/${response.data.sellerId}`,{
// //           headers: {
// //             Authorization: `Bearer ${token}` },
// //         });
// //         setReviewData((prevData) => ({
// //           ...prevData,
// //           [itemId]: itemReviews.data.reviews.find(
// //             (review) => review.buyerId === response.data.buyerId
// //           ),
// //         }));
// //       } else {
// //         console.error("Failed to submit review.");
// //       }
// //     } catch (error) {
// //       console.error("Error submitting review:", error);
// //     }
// //   };

// //   return (
// //     <div className="bought-orders-container">
// //       {/* <h2>Bought Items</h2> */}
// //       {loading ? (
// //         <p>Loading...</p>
// //       ) : (
// //         <ul className="bought-orders-list">
// //           {boughtItems.length > 0 ? (
// //             boughtItems.map((item) => (
// //               <li key={item._id} className="bought-order-card">
// //                 <div className="item-info">
// //                   <h3>{item.item.name}</h3>
// //                   <p>Price: ₹{item.item.price}</p>
// //                   <p>
// //                     Seller: {item.seller.firstName} {item.seller.lastName}
// //                   </p>
// //                   <p>
// //                     Purchase Date: {new Date(item.updatedAt).toLocaleDateString()}
// //                   </p>

// //                   {/* Show review if available */}
// //                   {reviewData[item._id] ? (
// //                     // If review already exists, display the review
// //                     <div className="existing-review">
// //                       <h4>Your Review:</h4>
// //                       <p>Rating: {reviewData[item._id].rating} / 5</p>
// //                       <p>{reviewData[item._id].comment}</p>
// //                     </div>
// //                   ) : (
// //                     // Show review form if no review exists
// //                     <div className="review-form">
// //                       <h4>Leave a Review</h4>
// //                       <div className="star-rating">
// //                         {[1, 2, 3, 4, 5].map((star) => (
// //                           <span
// //                             key={star}
// //                             className={`star ${tempRating >= star ? "filled" : ""}`}
// //                             onClick={() => handleStarClick(item._id, star)}
// //                           >
// //                             &#9733; {/* Star icon */}
// //                           </span>
// //                         ))}
// //                       </div>

// //                       <label>
// //                         Review:
// //                         <input
// //                           type="text"
// //                           value={tempComment}
// //                           onChange={(e) => setTempComment(e.target.value)} // Update comment temporarily
// //                         />
// //                       </label>
// //                       {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Error message */}

// //                       <button type="button" onClick={() => handleSubmitReview(item._id)}>
// //                         Submit Review
// //                       </button>
// //                     </div>
// //                   )}
// //                 </div>
// //               </li>
// //             ))
// //           ) : (
// //             <h2>No items bought yet!!!</h2>
// //           )}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // };

// // export default BoughtOrders;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./new_b.css"; // Add custom CSS for styling if needed

// const BoughtOrders = () => {
//   const [boughtItems, setBoughtItems] = useState([]);
//   const [reviewData, setReviewData] = useState({}); // Store review data for each item
//   const [loading, setLoading] = useState(true); // To handle loading state
//   const [errorMessage, setErrorMessage] = useState(""); // To handle error messages

//   // Store temporary ratings and comments for each item using item._id as the key
//   const [tempReviews, setTempReviews] = useState({});

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     // Fetch bought items
//     if (!token) {
//       console.error("Unauthorized access. Redirecting to login...");
//       return;
//     }

//     const fetchBoughtItems = async () => {
//       try {
//         const email = localStorage.getItem("userEmail"); // Retrieve user email from local storage
//         if (!email || !token) {
//           console.error("User email not found in local storage.");
//           return;
//         }

//         const response = await axios.get(
//           `http://localhost:5000/orders_bought/${email}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (response.data.success) {
//           setBoughtItems(response.data.boughtItems || []);
//         } else {
//           console.error("Failed to fetch bought items.");
//         }

//         // Fetch reviews for each item bought
//         await fetchReviews(response.data.boughtItems, email, token);
//       } catch (error) {
//         console.error("Error fetching bought items:", error);
//       }
//     };

//     const fetchReviews = async (items, buyerEmail) => {
//       try {
//         const reviews = {};
//         for (let item of items) {
//           const response = await axios.get(
//             `http://localhost:5000/reviews/${item._id}/${buyerEmail}/${item.seller._id}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           // If review exists for the item, store it
//           reviews[item._id] = response.data.review || null; // Store null if no review exists
//         }
//         setReviewData(reviews);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching reviews:", error);
//         setLoading(false);
//       }
//     };

//     fetchBoughtItems();
//   }, []);

//   // Handle Star Click
//   const handleStarClick = (itemId, rating) => {
//     setTempReviews((prevTempReviews) => ({
//       ...prevTempReviews,
//       [itemId]: { ...prevTempReviews[itemId], rating }, // Update rating for this specific item
//     }));
//   };

//   // Handle Review Input Change
//   const handleCommentChange = (itemId, comment) => {
//     setTempReviews((prevTempReviews) => ({
//       ...prevTempReviews,
//       [itemId]: { ...prevTempReviews[itemId], comment }, // Update comment for this specific item
//     }));
//   };

//   // Handle Review Submit
//   const handleSubmitReview = async (itemId) => {
//     const buyerEmail = localStorage.getItem("userEmail"); // Retrieve email from localStorage
//     const token = localStorage.getItem("token");

//     const { rating, comment } = tempReviews[itemId] || {}; // Get rating and comment for the specific item

//     if (!rating || !comment) {
//       setErrorMessage("Please provide both rating and comment before submitting.");
//       return;
//     }

//     if (!token || !buyerEmail) {
//       console.error("Unauthorized. Please log in again.");
//       setErrorMessage("Unauthorized. Please log in.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/reviews",
//         {
//           sellerId: boughtItems.find((item) => item._id === itemId).seller._id,
//           itemId,
//           buyerEmail,
//           rating,
//           comment,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         alert("Review submitted successfully!");
//         // Refetch reviews after submitting
//         const itemReviews = await axios.get(
//           `http://localhost:5000/reviews/${response.data.sellerId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setReviewData((prevData) => ({
//           ...prevData,
//           [itemId]: itemReviews.data.reviews.find(
//             (review) => review.buyerId === response.data.buyerId
//           ),
//         }));
//       } else {
//         console.error("Failed to submit review.");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//     }
//   };

//   return (
//     <div className="bought-orders-container">
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <ul className="bought-orders-list">
//           {boughtItems.length > 0 ? (
//             boughtItems.map((item) => (
//               <li key={item._id} className="bought-order-card">
//                 <div className="item-info">
//                   <h3>{item.item.name}</h3>
//                   <p>Price: ₹{item.item.price}</p>
//                   <p>
//                     Seller: {item.seller.firstName} {item.seller.lastName}
//                   </p>
//                   <p>
//                     Purchase Date: {new Date(item.updatedAt).toLocaleDateString()}
//                   </p>

//                   {/* Show review if available */}
//                   {reviewData[item._id] ? (
//                     <div className="existing-review">
//                       <h4>Your Review:</h4>
//                       <p>Rating: {reviewData[item._id].rating} / 5</p>
//                       <p>{reviewData[item._id].comment}</p>
//                     </div>
//                   ) : (
//                     <div className="review-form">
//                       <h4>Leave a Review</h4>
//                       <div className="star-rating">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <span
//                             key={star}
//                             className={`star ${tempReviews[item._id]?.rating >= star ? "filled" : ""}`}
//                             onClick={() => handleStarClick(item._id, star)}
//                           >
//                             &#9733; {/* Star icon */}
//                           </span>
//                         ))}
//                       </div>

//                       <label>
//                         Review:
//                         <input
//                           type="text"
//                           value={tempReviews[item._id]?.comment || ""}
//                           onChange={(e) => handleCommentChange(item._id, e.target.value)} // Update comment temporarily
//                         />
//                       </label>
//                       {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Error message */}

//                       <button type="button" onClick={() => handleSubmitReview(item._id)}>
//                         Submit Review
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </li>
//             ))
//           ) : (
//             <h2>No items bought yet!!!</h2>
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default BoughtOrders;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Boughtorders.css"; // Add custom CSS for styling if needed

const BoughtOrders = () => {
  const [boughtItems, setBoughtItems] = useState([]);
  const [reviewData, setReviewData] = useState({}); // Store review data for each item
  const [loading, setLoading] = useState(true); // To handle loading state
  const [errorMessage, setErrorMessage] = useState(""); // To handle error messages

  // Store temporary ratings and comments for each item using item._id as the key
  const [tempReviews, setTempReviews] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Fetch bought items
    if (!token) {
      console.error("Unauthorized access. Redirecting to login...");
      return;
    }

    const fetchBoughtItems = async () => {
      try {
        const email = localStorage.getItem("userEmail"); // Retrieve user email from local storage
        if (!email || !token) {
          console.error("User email not found in local storage.");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/orders_bought/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setBoughtItems(response.data.boughtItems || []);
        } else {
          console.error("Failed to fetch bought items.");
        }

        // Fetch reviews for each item bought
        await fetchReviews(response.data.boughtItems, email, token);
      } catch (error) {
        console.error("Error fetching bought items:", error);
      }
    };

    const fetchReviews = async (items, buyerEmail) => {
      try {
        const reviews = {};
        for (let item of items) {
          const response = await axios.get(
            `http://localhost:5000/reviews/${item._id}/${buyerEmail}/${item.seller._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // If review exists for the item, store it
          reviews[item._id] = response.data.review || null; // Store null if no review exists
        }
        setReviewData(reviews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchBoughtItems();
  }, []);

  // Handle Star Click
  const handleStarClick = (itemId, rating) => {
    setTempReviews((prevTempReviews) => ({
      ...prevTempReviews,
      [itemId]: { ...prevTempReviews[itemId], rating }, // Update rating for this specific item
    }));
  };

  // Handle Review Input Change
  const handleCommentChange = (itemId, comment) => {
    setTempReviews((prevTempReviews) => ({
      ...prevTempReviews,
      [itemId]: { ...prevTempReviews[itemId], comment }, // Update comment for this specific item
    }));
  };

  // Handle Review Submit
  const handleSubmitReview = async (itemId) => {
    const buyerEmail = localStorage.getItem("userEmail"); // Retrieve email from localStorage
    const token = localStorage.getItem("token");

    const { rating, comment } = tempReviews[itemId] || {}; // Get rating and comment for the specific item

    if (!rating || !comment) {
      setErrorMessage("Please provide both rating and comment before submitting.");
      return;
    }

    if (!token || !buyerEmail) {
      console.error("Unauthorized. Please log in again.");
      setErrorMessage("Unauthorized. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/reviews",
        {
          sellerId: boughtItems.find((item) => item._id === itemId).seller._id,
          itemId,
          buyerEmail,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Review submitted successfully!");

        // Refetch reviews after submitting and update the state
        const itemReviews = await axios.get(
          `http://localhost:5000/reviews/${response.data.sellerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update the review data for the specific item in the state
        setReviewData((prevData) => ({
          ...prevData,
          [itemId]: itemReviews.data.reviews.find(
            (review) => review.buyerId === response.data.buyerId
          ),
        }));

        // Optionally, clear the temp reviews state if desired
        setTempReviews((prevTempReviews) => ({
          ...prevTempReviews,
          [itemId]: { rating: null, comment: "" }, // Clear temporary data for the submitted review
        }));
      } else {
        console.error("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="bought-orders-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="bought-orders-list">
          {boughtItems.length > 0 ? (
            boughtItems.map((item) => (
              <li key={item._id} className="bought-order-card">
                <div className="item-info">
                  <h3>{item.item.name}</h3>
                  <p>Price: ₹{item.item.price}</p>
                  <p>
                    Seller: {item.seller.firstName} {item.seller.lastName}
                  </p>
                  <p>
                    Purchase Date: {new Date(item.updatedAt).toLocaleDateString()}
                  </p>

                  {/* Show review if available */}
                  {reviewData[item._id] ? (
                    <div className="existing-review">
                      <h4>Your Review:</h4>
                      <p>Rating: {reviewData[item._id].rating} / 5</p>
                      <p>{reviewData[item._id].comment}</p>
                    </div>
                  ) : (
                    <div className="review-form">
                      <h4>Leave a Review</h4>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star ${tempReviews[item._id]?.rating >= star ? "filled" : ""}`}
                            onClick={() => handleStarClick(item._id, star)}
                          >
                            &#9733; {/* Star icon */}
                          </span>
                        ))}
                      </div>

                      <label>
                        Review:
                        <input
                          type="text"
                          value={tempReviews[item._id]?.comment || ""}
                          onChange={(e) => handleCommentChange(item._id, e.target.value)} // Update comment temporarily
                        />
                      </label>
                      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Error message */}

                      <button type="button" onClick={() => handleSubmitReview(item._id)}>
                        Submit Review
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <h2>No items bought yet!!!</h2>
          )}
        </ul>
      )}
    </div>
  );
};

export default BoughtOrders;
