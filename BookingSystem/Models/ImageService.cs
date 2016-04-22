using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class ImageService
    {
        MemoryStream ms;
        string base64string;
        byte[] bytes;
        Image image;
        string UploadImagePath;

        const int MAX_IMAGE_HEIGHT = 400;
        const int MAX_IMAGE_WIDTH = 400;
        const int MIN_IMAGE_HEIGHT = 10;
        const int MIN_IMAGE_WIDTH = 10;

        public string SaveImage(string IMAGE_PATH, string base64string, int locationId)
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
                    throw new Exception("Maximum image dimensions are: Width: 400px and Height: 400px. Minimum image dimensions are: Width: 10px and Height 10px.");
                }

                // Build uploadpath
                UploadImagePath = HttpContext.Current.Server.MapPath(String.Format(@"~/{0}", IMAGE_PATH));

                // Save image
                image.Save(String.Format("{0}/{1}.jpg", UploadImagePath, locationId), System.Drawing.Imaging.ImageFormat.Jpeg);

                // Return relative path to image
                return String.Format("{0}/{1}.jpg", IMAGE_PATH, locationId);
            }
        }
    }
}