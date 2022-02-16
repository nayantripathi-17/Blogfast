import TextField from "@mui/material/TextField";

export default function ProfileTextField({ startValue, label }: { startValue: string, label: string }) {

  return (
    <>
      <TextField
        aria-label={`${label} textfield : disabled`}
        className="w-2/3 md:w-2/5"
        FormHelperTextProps={{
          style: { textAlign: "right", lineHeight: 2 },
        }}
        InputProps={{
          inputProps: {
            style: { fontSize: "1.125rem", lineHeight: "1.75rem" },
            name: { label },
          },
        }}
        InputLabelProps={{
          style: { fontSize: `1.12rem`, lineHeight: `1.75rem` },
        }}
        classes={{ root: "block" }}
        margin="normal"
        variant="outlined"
        label={label}
        value={startValue}
        fullWidth={true}
        multiline={false}
        required={true}
        disabled={true}
      />

    </>
  )
}

