import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { CustomTextFieldPropsAndHandlers } from "../types";

function TextfieldTitle({ textValue, calculateTextLength }: CustomTextFieldPropsAndHandlers) {
  return (
    <Paper elevation={7} className="items-center m-5 p-5">
      <TextField
        aria-label="Content Textfield : enabled"
        FormHelperTextProps={{
          style: { textAlign: "right", lineHeight: 2 },
        }}
        InputProps={{
          inputProps: {
            style: { fontSize: "1.125rem", lineHeight: "1.75rem" },
            name: "title",
          },
        }}
        InputLabelProps={{
          style: { fontSize: `1.12rem`, lineHeight: `1.75rem` },
        }}
        classes={{ root: "block" }}
        margin="normal"
        variant="filled"
        label="Title"
        value={textValue}
        fullWidth={true}
        multiline={false}
        required={true}
        onChange={calculateTextLength}
        helperText={
          textValue.length > 0 ? `${textValue.length}` : `Write A Catchy Title`
        }
      />
    </Paper>
  );
}

export default TextfieldTitle;
