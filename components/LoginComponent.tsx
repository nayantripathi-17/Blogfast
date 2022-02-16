import { signIn } from "next-auth/react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function LoginComponent() {

  return (
    <main aria-label="Login Page" className="mt-10 text-center scroll-mb-10">
      <Typography variant="h2" className="mb-5">
        Providers
      </Typography>
      <Button
        aria-label="Login with Google"
        onClick={() =>
          signIn("google", { callbackUrl: "http://127.0.0.1:3000" })
        }
        variant="outlined"
        className="align-middle py-2.5 normal-case"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="m-0 inline"
          width={"25rem"}
          height={"25rem"}
          alt="Google sign-in"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
        />
        <Typography className="ml-4" variant="body1">
          Login With Google
        </Typography>
      </Button>
    </main>
  );
}

export default LoginComponent;
