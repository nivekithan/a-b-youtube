import type { MutableRefObject } from "react";
import React, { useRef, useState } from "react";

export type FileInputProps = {
  name: string;
  setUploads: Function;
};

// const getSelectedFileName = (
//   fileInputRef: MutableRefObject<HTMLInputElement | null>
// ) => {
//   const selectedFileName = fileInputRef.current?.files?.[0]?.name;

//   if (typeof selectedFileName === "string") {
//     return selectedFileName;
//   }

//   return null;
// };

export const FileInput = ({ name, setUploads }: FileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [_, doReRender] = useState({});

  // const selectedFileName = getSelectedFileName(fileInputRef);
  // const isFileSelected = selectedFileName !== null;

  // const fileName = isFileSelected ? selectedFileName : "Select thumbnail";
  // const buttonText = isFileSelected ? "Remove" : "Select";

  const onFileInput = () => {
    const files = fileInputRef.current?.files;
    setUploads(files)
    doReRender({});
  };

  const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // if (!isFileSelected) {
    //   fileInputRef.current?.click();
    //   return;
    // }

    const files = fileInputRef.current?.files;

    if (files === null || files === undefined) {
      return;
    }

    const fileInput = fileInputRef.current;
    if (fileInput === null) {
      return null;
    }

    fileInput.files = new DataTransfer().files;
    doReRender({});
  };

  return (
    <div>
      <input
        type="file"
        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
        multiple
        hidden
        name={name}
        onInput={onFileInput}
        ref={fileInputRef}
      />
      <button
        onClick={onButtonClick}
        className="home-input-file-button card-button"
      >
        {/* <span>{fileName}</span> */}
        {/* {buttonText} */}
        Select Images for Thumbnail
      </button>
    </div>
  );
};
