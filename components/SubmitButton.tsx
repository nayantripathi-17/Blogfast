import Check from "@mui/icons-material/Check";
import SendRounded from "@mui/icons-material/SendRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { SubmitButtonProps } from "../types";

function SubmitButton({ isSubmitted, isLoading }: SubmitButtonProps) {
  return (
    <LoadingButton
      aria-label="Submit Button"
      loading={isLoading}
      type="submit"
      variant="contained"
      className={isLoading?
        "justify-end pl-2 pr-2 md:pl-4 md:pr-4 bg-[#004A94BF] hover:bg-[#004A94FF]"
        :"justify-end pl-2 pr-2 md:pl-4 md:pr-4 bg-[#004A94BF] text-white hover:bg-[#004A94FF]"}
    >
      {!isSubmitted ? (
        <>
          Submit&nbsp;
          <SendRounded />
        </>
      ) : (
        <Check />
      )}
    </LoadingButton>
  );
}

export default SubmitButton;
