import React from "react";

export default function BlueBtn(props) {
  return (
    <button
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
      className={`${props.styles} bg-normalBlue hover:bg-voteText text-white p-4 rounded-lg font-medium`}
    >
      {props.content}
    </button>
  );
}
