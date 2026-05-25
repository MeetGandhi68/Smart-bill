import sharp from "sharp";

export const preprocessImage = async (imagePath: string) => {
  const processedImagePath = imagePath.replace(
    /\.(jpg|jpeg|png)$/i,
    "-processed.png",
  );

  await sharp(imagePath)
    /* enlarge image */
    .resize({
      width: 2200,
    })

    /* grayscale */
    .grayscale()

    /* improve contrast */
    .normalize()

    /* sharpen text */
    .sharpen()

    /* threshold = black & white */
    .threshold(180)

    .png()

    .toFile(processedImagePath);

  return processedImagePath;
};
