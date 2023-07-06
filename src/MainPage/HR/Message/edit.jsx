import React from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./editorToolBar";
import "react-quill/dist/quill.snow.css";

export const Edit = ({ placeholder, onChange, value }) => {

    return (
        <div className="text-editor">
            <EditorToolbar />
            <ReactQuill
                theme="snow"
                modules={modules}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
                formats={formats}
                style={{ height: "35vh" }}
            />
        </div>
    );
};

export default Edit;
