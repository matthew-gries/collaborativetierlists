import { useDrag } from "react-dnd";

export const ElementComponent = (props) => {

  const isImage = props.image;

  const [ { isDragging }, drag] = useDrag(() => ({
    type: "element",
    item: {
      type: "element",
      element: isImage ? props.name : props.text
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [isImage, props]);

  if (isImage){
    return (
      <img ref={drag} src={props.url} alt={props.name} loading="lazy" />
    );
  } else {
    return (
      <p ref={drag}>{props.text}</p>
    );
  }
}