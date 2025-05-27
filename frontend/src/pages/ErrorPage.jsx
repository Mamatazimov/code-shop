import { useRouteError,Link } from "react-router-dom";

function ErrorPage() {
    const error = useRouteError();
    if (error.status === 404) {
        return (
            <div className="error-page">
                <h1>404 Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.<br/>Just drink some coffee and wait 100year for devs build this page☕.</p>
                <Link to="/" className="btn">Go back to Home</Link>
            </div>
        );
    }

  return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <Link to="/" className="btn">Go back to Home</Link>
    </div>
  );
}
export default ErrorPage;