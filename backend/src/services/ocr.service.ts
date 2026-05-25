import Tesseract from "tesseract.js";

export const extractTextFromImage = async (
  imagePath: string
) => {
  try {

    const result = await Tesseract.recognize(
      imagePath,
      "eng"
    );

    return result.data.text;

  } catch (error) {

    console.log(error);

    throw new Error("OCR Failed");
  }
};