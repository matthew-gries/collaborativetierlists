import React, { useState } from "react";
import Parse from "parse";
import { FileUploader } from "react-drag-drop-files";
import { TextField } from "@mui/material"
import { removeFileExtension } from "../utils";

const FILE_TYPES = ["JPG", "PNG", "GIF"];

export const NewElementComponent = (props) => {

  const code = props.code;

  const [textField, setTextField] = useState("");

  const queryRoomObject = () => {
    let roomQuery = new Parse.Query("Room");
    roomQuery.contains("code", code);
    return roomQuery.find()
  }

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      const parseFile = new Parse.File(file.name, {base64: reader.result});
      let result = null;
      queryRoomObject()
        .then((results) => {
          result = results[0];
          return parseFile.save();
        }).then((response) => {
          result.set('images', [...result.get('images'), response]);
          const elementTierMap = result.get('elementTierMap');
          elementTierMap[removeFileExtension(response.name())] = null;
          result.set('elementTierMap', elementTierMap);
          return result.save();
        }).then(() => {
          alert("New item successfully created!");
        }).catch((e) => {
          alert("Could not upload file: " + e);
        });
    }

    reader.onerror = function(e) {
      alert("Could not upload file: " + e);
    }
  }

  const handleNewTextUpload = (event) => {
    event.preventDefault();
    queryRoomObject()
      .then((results) => {
        const result = results[0];
        result.set('text', [...result.get('text'), textField]);
        const elementTierMap = result.get('elementTierMap');
        elementTierMap[textField] = null;
        result.set('elementTierMap', elementTierMap);
        return result.save();
      })
      .then(() => {
        alert("New item successfully created!");
      })
      .catch((e) => {
        alert("Could not create new text item: " + e);
      });
  }

  const handleNewText = (event) => {
    const text = event.target.value;
    setTextField(text);
  }

  return (
    <div>
      <FileUploader handleChange={handleImageUpload} name="file" types={FILE_TYPES} />
      <form onSubmit={handleNewTextUpload}>
        <TextField id="text-input" label="New Item" variant="outlined" onChange={handleNewText}/>
      </form>
    </div>
  )
}