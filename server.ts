import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import * as fs from "fs";
import * as multer from "multer";

const PORT = 8000;
const app = express();
config();

app.use(express.json());
app.use(cors());

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);
let lastFilePath = "";

const storage = multer.diskStorage({
  destination: (_, _2, cb) => {
    cb(null, "public");
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer.default({ storage: storage }).single("file");

app.post("/images", async (req: Request, res: Response) => {
  try {
    const response = await openai.createImage({
      prompt: req.body.message,
      n: 10,
      size: "1024x1024",
    });
    console.log(response.data.data);
    res.send(response.data.data);
  } catch (error) {
    console.log(error);
  }
});

app.post("/upload", async (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    console.log(req.file);
    if (req.file) {
      lastFilePath = req.file.path;
    }
    return res.status(200);
  });
});

app.post("/variations", async (_: Request, res: Response) => {
  try {
    const response = await openai.createImageVariation(
      fs.createReadStream(lastFilePath) as any, // Not sure how to make this non-'any'.
      10,
      "1024x1024"
    );
    res.send(response.data.data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
