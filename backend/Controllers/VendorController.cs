using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Sets the base route for all endpoints here to /api/vendor.
    [Authorize(Roles = "Vendor")]
    public class VendorController : ControllerBase
    {
        private readonly VendorService _vendorService;
        public VendorController(VendorService vendorService)
        {
            _vendorService = vendorService;
        }
        
        // Defines the endpoint at GET /api/vendor/employees
        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees()
        {
            // Get the authenticated user's ID from their JWT claims. This is a secure way to identify the user.
            var vendorUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var employees = await _vendorService.GetEmployeesAsync(vendorUserId);
            // Return the list of employees with a 200 OK status.
            return Ok(employees);
        }

        // Defines the endpoint at POST /api/vendor/employees
        // [FromForm] is crucial here. It tells the API to expect 'multipart/form-data',
        // which is the format used for requests that include files.
        [HttpPost("employees")]
        public async Task<IActionResult> CreateEmployee([FromForm] CreateEmployeeDto dto)
        {
            var vendorUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var employee = await _vendorService.CreateEmployeeAsync(dto, vendorUserId);
            if (employee == null)
            {
                return BadRequest("Could not create employee.");
            }
            // Return a 201 Created response, which is the standard for successful resource creation.
            // It includes a URL to the newly created employee and the employee object itself.
            return CreatedAtAction(nameof(GetEmployeeById), new { id = employee.Id }, employee);
        }
        
        // Defines the endpoint at GET /api/vendor/employees/{id}
        [HttpGet("employees/{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var vendorUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var employee = await _vendorService.GetEmployeeByIdAsync(id, vendorUserId);
            // If the service returns null, it means the employee was not found or doesn't belong to this vendor.
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        // Defines the endpoint at PUT /api/vendor/employees/{id}
        [HttpPut("employees/{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeDto dto)
        {
            var vendorUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var employee = await _vendorService.UpdateEmployeeAsync(id, dto, vendorUserId);
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        // Defines the endpoint at DELETE /api/vendor/employees/{id}
        [HttpDelete("employees/{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var vendorUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var success = await _vendorService.DeleteEmployeeAsync(id, vendorUserId);
            if (!success) return NotFound();
            // Return a 204 No Content response, which is standard for successful deletions.
            return NoContent();
        }
    }
}