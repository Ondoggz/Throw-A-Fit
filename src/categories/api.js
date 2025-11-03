export const getCategory = async (category) => {
  try {
    const response = await fetch(
      `https://your-api-name.onrender.com/api/items/${category}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    return { message: "Failed to connect to API" };
  }
};
