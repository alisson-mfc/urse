import React from "react";
import { useDropzone } from "react-dropzone";
import "./style.scss";

type DropzoneProps = {
  useDropzoneProps: {};
  files?: boolean;
  text?: string;
};
function Dropzone(props: DropzoneProps) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone(
    props.useDropzoneProps
  );
  const { files, text } = props;
  console.log("files: ", files);
  const filesList = acceptedFiles.map((file: any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {text && <p>{text}</p>}
        {!text && (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {(files !== undefined || files) && (
        <aside>
          <h4>Files</h4>
          <ul>{filesList}</ul>
        </aside>
      )}
    </section>
  );
}

export default Dropzone;
