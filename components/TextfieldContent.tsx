import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { CustomTextFieldPropsAndHandlers } from "../types";

function TextfieldContent({ textValue, calculateTextLength }: CustomTextFieldPropsAndHandlers) {
  return (
    <Paper elevation={7} className="items-center m-5 p-5 text-lg">
      <TextField
      aria-label="Content Textfield : enabled"
        FormHelperTextProps={{
          style: { textAlign: "right", lineHeight: "1.5 rem" },
        }}
        InputProps={{
          inputProps: {
            name: "content",
            spellCheck: "true",
          },
        }}
        classes={{ root: "block" }}
        margin="normal"
        variant="outlined"
        label="Content"
        value={textValue}
        minRows={10}
        maxRows={15}
        fullWidth={true}
        multiline={true}
        required={true}
        onChange={calculateTextLength}
        helperText={
          textValue.length > 0 ? `${textValue.length}` : `Write Some Content`
        }
      />
    </Paper>
  );
}

export default TextfieldContent;
