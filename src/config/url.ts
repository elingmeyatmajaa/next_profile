const Url = {
  api: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  storage: process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000/storage",
};

export default Url;