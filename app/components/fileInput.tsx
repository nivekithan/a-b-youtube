import React, { useEffect, useRef } from "react";

export type FileInputProps = {
  name: string;
  withMessageUrls: (urls: string[]) => void;
};

export const FileInput = ({ name, withMessageUrls }: FileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onReset = () => {
      withMessageUrls([]);
    };
    document.getElementById("homePageForm")?.addEventListener("reset", onReset);

    return () => {
      document
        .getElementById("homePageForm")
        ?.removeEventListener("reset", onReset);
    };
  }, [withMessageUrls]);

  const onFileInput = () => {
    const files = fileInputRef.current?.files;

    if (files === null || files === undefined || files.length === 0) {
      withMessageUrls([]);
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
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg"
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
