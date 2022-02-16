import CircularProgress from "@mui/material/CircularProgress";

function CircularLoading() {
  return (
    <section className="flex flex-grow justify-center">
      <CircularProgress
        aria-describedby="Loading"
        aria-busy="true"
        color="inherit"
      />
    </section>
  );
}

export default CircularLoading;
