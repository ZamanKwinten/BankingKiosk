import { TextField, TextFieldProps } from "@mui/material";
import { InputMask, InputMaskProps, Replacement } from "@react-input/mask";
import { forwardRef, useMemo } from "react";

type props = {
  mask: string;
  replacement: Replacement;
  maskCompleteCallback?: (value: string) => void;
  maskIncompleteCallback?: () => void;
} & TextFieldProps;

export default function MaskedTextField(props: props) {
  const { mask, replacement, maskCompleteCallback, maskIncompleteCallback } =
    props;

  const ForwardedInputMask = useMemo(
    () =>
      forwardRef<HTMLInputElement, InputMaskProps>((props, forwardedRef) => {
        return (
          <InputMask
            ref={forwardedRef}
            mask={mask}
            showMask={true}
            replacement={replacement}
            onMask={(event) => {
              const maskEvent = event.detail;
              if (maskEvent.isValid) {
                maskCompleteCallback && maskCompleteCallback(maskEvent.input);
              } else {
                maskIncompleteCallback && maskIncompleteCallback();
              }
            }}
            {...props}
          />
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mask]
  );

  return (
    <TextField
      InputProps={{
        inputComponent: ForwardedInputMask,
      }}
      {...props}
    />
  );
}
