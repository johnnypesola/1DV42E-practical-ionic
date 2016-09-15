using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class ImageService
    {
        MemoryStream ms;
        byte[] bytes;
        Image image;
        string UploadImagePath;
        string dateNowStr;

        const int MAX_IMAGE_HEIGHT = 400;
        const int MAX_IMAGE_WIDTH = 400;
        const int MIN_IMAGE_HEIGHT = 10;
        const int MIN_IMAGE_WIDTH = 10;

        const int THUMBNAIL_IMAGE_HEIGHT = 40;
        const int THUMBNAIL_IMAGE_WIDTH = 40;

        const string THUMBNAIL_EXTRA_FILENAME = ".thumbnail";
        const string IMAGE_FILE_EXTENSION = "jpg";

        static readonly Color PADDING_COLOR = Color.Black;

        public string SaveImage(string IMAGE_PATH, string base64string, int objectId)
        {
            bytes = Convert.FromBase64String(base64string);

            using (ms = new MemoryStream(bytes))
            {
                image = Image.FromStream(ms);

                // Check image dimensions
                if (
                    image.Width > MAX_IMAGE_WIDTH ||
                    image.Height > MAX_IMAGE_HEIGHT ||
                    image.Width < MIN_IMAGE_WIDTH ||
                    image.Height < MIN_IMAGE_HEIGHT
                   )
                {
                    throw new Exception(
                        String.Format(
                            "Maximum image dimensions are: Width: {0}px and Height: {1}px. Minimum image dimensions are: Width: {2}px and Height {3}px.", 
                            MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT, MIN_IMAGE_WIDTH, MIN_IMAGE_HEIGHT
                        )
                    );
                }

                // Build uploadpath
                UploadImagePath = HttpContext.Current.Server.MapPath(String.Format(@"~/{0}", IMAGE_PATH));

                // Build date string
                dateNowStr = DateTime.Now.ToString("MMddHHmmss");

                // Save image
                image.Save(String.Format("{0}/{1}-{2}.{3}", UploadImagePath, objectId, dateNowStr, IMAGE_FILE_EXTENSION), System.Drawing.Imaging.ImageFormat.Jpeg);

                // Make thumbnail
                Bitmap thumbnail = ResizeImage(image, THUMBNAIL_IMAGE_WIDTH, THUMBNAIL_IMAGE_HEIGHT);

                // Save thumbnail
                thumbnail.Save(String.Format("{0}/{1}-{2}{3}.{4}", UploadImagePath, objectId, dateNowStr, THUMBNAIL_EXTRA_FILENAME, IMAGE_FILE_EXTENSION), System.Drawing.Imaging.ImageFormat.Jpeg);

                // Return relative path to image
                return String.Format("{0}/{1}-{2}.{3}", IMAGE_PATH, objectId, dateNowStr, IMAGE_FILE_EXTENSION);
            }
        }

        public void DeleteImage(string IMAGE_PATH)
        {
            // Get image path
            string imageForObject = HttpContext.Current.Server.MapPath(String.Format(@"~/{0}", IMAGE_PATH));

            // Remove uploaded file if it exists
            if (File.Exists(@imageForObject))
            {
                File.Delete(@imageForObject);
            }

            // Get thumbnail path
            string fileExtension = (IMAGE_PATH.Length > 0 ? IMAGE_PATH.Substring(IMAGE_PATH.Length - 4) : String.Empty);

            if (fileExtension == String.Format(".{0}", IMAGE_FILE_EXTENSION))
            {
                string filePartialPath = IMAGE_PATH.Substring(0, IMAGE_PATH.Length - 4);

                string imageThumbnailForObject = HttpContext.Current.Server.MapPath(String.Format(@"~/{0}{1}.{2}", filePartialPath, THUMBNAIL_EXTRA_FILENAME, IMAGE_FILE_EXTENSION));

                // Remove thumbnail if it exists
                if (File.Exists(imageThumbnailForObject))
                {
                    File.Delete(imageThumbnailForObject);
                }
            }
        }

        /// <summary>
        /// Resize the image to the specified width and height.
        /// </summary>
        /// <param name="image">The image to resize.</param>
        /// <param name="width">The width to resize to.</param>
        /// <param name="height">The height to resize to.</param>
        /// <returns>The resized image.</returns>
        public static Bitmap ResizeImage(Image image, int width, int height)
        {
            // Calculate the aspect ratio for the destination image
            double ratioX = (double)width / (double)image.Width;
            double ratioY = (double)height / (double)image.Height;

            double ratio = ratioX < ratioY ? ratioX : ratioY;

            // Calculate the height and width for the destnation image
            int newHeight = Convert.ToInt32(image.Height * ratio);
            int newWidth = Convert.ToInt32(image.Width * ratio);

            // Calculate center positioning of new resized image
            int posX = Convert.ToInt32((width - ((double)image.Width * ratio)) / 2);
            int posY = Convert.ToInt32((height - ((double)image.Height * ratio)) / 2);

            // Create image
            var destImage = new Bitmap(width, height);

            destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

            using (var graphics = Graphics.FromImage(destImage))
            {
                // Set options
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.CompositingQuality = CompositingQuality.HighQuality;
                graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                graphics.SmoothingMode = SmoothingMode.HighQuality;
                graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

                // Draw
                graphics.Clear(PADDING_COLOR);
                graphics.DrawImage(image, posX, posY, newWidth, newHeight);
            }

            return destImage;
        }
    }
}