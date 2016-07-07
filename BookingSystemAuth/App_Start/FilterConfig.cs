using System.Web;
using System.Web.Mvc;

namespace BookingSystemAuth
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            // Add user friendly error page on controller all controller action errors
            filters.Add(new HandleErrorAttribute());
        }
    }
}
