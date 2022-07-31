import React, { useRef, useState } from "react";

export type FileInputProps = {
  name: string;
  withMessageUrls: (urls: string[]) => void;
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

export const FileInput = ({ name, withMessageUrls }: FileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onFileInput = () => {
    const files = fileInputRef.current?.files;

    if (files === null || files === undefined || files.length === 0) {
      return;
    }

    const fileUrls: string[] = [];

    for (const file of files) {
      const url = URL.createObjectURL(file);
      fileUrls.push(url);
    }

    withMessageUrls(fileUrls);
  };

  const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    fileInputRef.current?.click();

    // if (!isFileSelected) {
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpg"
        multiple
        hidden
        name={name}
        onInput={onFileInput}
        ref={fileInputRef}
      />
      <button
        type="button"
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
