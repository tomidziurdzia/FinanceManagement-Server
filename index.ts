import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db";
import userRoutes from "./src/routes/user.routes";
import categoriesRoutes from "./src/routes/category.routes";

const app = express();
app.use(express.json());
dotenv.config();

connectDB();

// Configurar CORS
// const whitelist = [process.env.FRONTEND_URL];
// const corsOptions = {
//   origin: function (origin: any, callback: any) {
//     if (whitelist.indexOf(origin) !== -1) {
//       // El origen del request esta permitido
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };
// app.use(cors(corsOptions));

// Routing
app.use("/api/users", userRoutes);
app.use("/api/categories", categoriesRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
