import React from "react";
import Parse from "parse";
import { ImageList, ImageListItem } from "@mui/material";
import { ElementComponent } from "./ElementComponent";
import { useDrop } from "react-dnd";
import { removeFileExtension } from "../utils";

export const ElementContainerComponent = (props) => {

  const code = props.code;
  const tag = props.tag;
  const images = props.images;
  const textElements = props.textElements;
  const elementTierMap = props.elementTierMap;

  const moveElement = (element, tier) => {
    // Update server
    let roomQuery = new Parse.Query("Room");
    roomQuery.contains("code", code);
    roomQuery.find()
      .then((results) => {
        const result = results[0];
        const elementTierMap = result.get('elementTierMap');
        elementTierMap[element] = tier;
        result.set('elementTierMap', elementTierMap);
        return result.save();
      }).then(() => {
        console.log("Item successfully moved!");
      }).catch((e) => {
        alert("Could not move item: " + e);
      });
  }

  const [ { item, canDrop }, drop] = useDrop(() => ({
    accept: "element",
    drop: (item) => moveElement(item.element, tag),
    collect: (monitor) => ({
      item: monitor.getItem(),
      canDrop: !!monitor.canDrop()
    })
  }), [tag]);

  if (item) {
    console.log(item)
  }
  if (canDrop) {
    console.log(tag);
  }

  return (
    <div ref={drop} style={{
      borderStyle: "solid",
      borderColor: "white"
    }}>
      <ImageList>
        {images.map((item, i) => {
          if (elementTierMap.get(removeFileExtension(item.name())) === tag) {
            return (
              <ImageListItem key={i}>
                <ElementComponent key={i} image url={item.url()} name={removeFileExtension(item.name())}/>
              </ImageListItem>
            );
          } else {
            return <ImageListItem key={i}><div key={i}></div></ImageListItem>;
          }
        })}
      </ImageList>
      <div>
        {textElements.map((item, i) => {
          if (elementTierMap.get(item) === tag) {
            return <ElementComponent key={i} text={item} />;
          } else {
            return <div key={i}></div>;
          }
        })}
      </div>
    </div>
  )

}