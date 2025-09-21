using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [ApiExplorerSettings(IgnoreApi = true)] // Hides this from Swagger
    public class ErrorController : ControllerBase
    {
        [Route("/error")]
        public IActionResult HandleError()
        {
            // You can add logging here to capture the actual exception
            var exceptionHandlerFeature = HttpContext.Features.Get<IExceptionHandlerFeature>();
            var exception = exceptionHandlerFeature?.Error;
            Console.WriteLine(exception);
            
            return Problem(
                title: "An unexpected error occurred.",
                statusCode: 500
            );
        }
    }
}