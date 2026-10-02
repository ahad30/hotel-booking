/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useSelector } from "react-redux";

const ZCkEditor = ({ setDescription }) => {
  const [editorData, setEditorData] = useState("");

  const handleEditorChange = (_event, editor) => {
    const data = editor.getData();
    setEditorData(data);

    if (data.trim() === "") {
      setDescription("");
    } else {
      setDescription(data);
    }
  };

  const { isAddModalOpen, isEditModalOpen } = useSelector(
    (state) => state.modal
  );

  useEffect(() => {
    if (!isAddModalOpen || !isEditModalOpen) {
      setEditorData("");
      setDescription("");
    }
  }, [isAddModalOpen, isEditModalOpen]);

  return (
    <div className="App my-5" style={{
      overflowWrap: "break-word",
      wordBreak: "break-word",
      width: "100%",
      boxSizing: "border-box",
    }}>
    <CKEditor
      editor={ClassicEditor}
      data={editorData}
      onReady={(_editor) => {
        // Editor is ready
      }}
      onChange={handleEditorChange}
      onBlur={(_event, _editor) => {
        // Handle blur
      }}
      onFocus={(_event, _editor) => {
        // Handle focus
      }}
    />
  </div>
  );
};

export default ZCkEditor;
