import "reflect-metadata";
import { createExpressServer } from "routing-controllers";
import dotenv from "dotenv";

dotenv.config();

const app = createExpressServer({
  controllers: [__dirname + "/controller/*.ts"],
}); //


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});