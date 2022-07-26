import type { MutableRefObject } from "react";
import React, { useRef, useState } from "react";

export type FileInputProps = {
  name: string;
};

const getSelectedFileName = (
  fileInputRef: MutableRefObject<HTMLInputElement | null>
) => {
  const selectedFileName = fileInputRef.current?.files?.[0]?.name;

  if (typeof selectedFileName === "string") {
    return selectedFileName;
  }

  return null;
};

export const FileInput = ({ name }: FileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [_, doReRender] = useState({});

  const selectedFileName = getSelectedFileName(fileInputRef);
  const isFileSelected = selectedFileName !== null;

  const fileName = isFileSelected ? selectedFileName : "Select thumbnail";
  const buttonText = isFileSelected ? "Remove" : "Select";

  const onFileInput = () => {
    doReRender({});
  };

  const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!isFileSelected) {
      fileInputRef.current?.click();
      return;
    }

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
    <div className="bg-gray-300 rounded-md">
      <input
        type="file"
        hidden
        name={name}
        onInput={onFileInput}
        ref={fileInputRef}
      />
      <div className="flex justify-between items-center pl-3">
        <span>{fileName}</span>
        <button
          type="button"
          className="bg-gray-700 text-white px-8 py-2 rounded-md"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
