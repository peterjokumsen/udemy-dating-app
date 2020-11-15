namespace Api.Errors
{
    public class ApiException
    {
        public ApiException(int statusCode, string title = null, string details = null)
        {
            StatusCode = statusCode;
            Title = title;
            Details = details;
        }

        public int StatusCode { get; set; }
        public string Title { get; set; }
        public string Details { get; set; }
    }
}
