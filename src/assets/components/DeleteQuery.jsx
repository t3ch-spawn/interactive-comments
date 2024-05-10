import React, { useEffect, useRef, useState } from "react";
import BlueBtn from "./BlueBtn";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function DeleteQuery(props) {
  const timeline = useRef(null);
  // const [delCancel, setDelCancel] = useState("");
  const delCancel = useRef("");
  useGSAP(() => {
    timeline.current = gsap
      .timeline()
      .from(".overlay", {
        opacity: 0,
        pointerEvents: "all",
        onReverseComplete: () => {
          gsap.to(".overlay", {
            pointerEvents: "none",
          });
          if (delCancel.current == "cancel") {
            props.cancel();
          } else if (delCancel.current == "delete") {
            gsap.to(props.el, {
              x: 100,
              opacity: 0,
              // scaleY: 0,
              ease: "back.in(4)",
            });

            gsap.to(props.el, {
              height: 0,
              duration: 0.7,
              ease: "back.in(4)",
              onComplete: () => {
                props.delete();
              },
            });
          }
        },
      })
      .from(".delete", {
        delay: -0.1,
        y: 100,
        opacity: 0,
        ease: "back.out(4)",

        transformOrigin: "center",
      })
      .to(".delete", {
        scaleY: 1,
        delay: -0.3,
        ease: "back.out(4)",
      });
  }, []);

  return (
    <>
      <div className="delete scale-y-[0.01] flex flex-col rounded-xl p-6 max-w-[400px] z-[40] bg-white shadow-md items-start justify-start gap-6 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <h3 className="text-2xl font-semibold text-deepBlue">Delete Comment</h3>

        <p className="text-commentBlue">
          Are you sure you want to delete this comment? This will remove the
          comment(including its replies) and can't be undone.
        </p>

        <div className="flex justify-center w-full items-center gap-4">
          <BlueBtn
            onClick={() => {
              if (props.cancel) {
                delCancel.current = "cancel";
                timeline.current.reverse();
              }
            }}
            content="NO, CANCEL"
            styles={"!bg-commentBlue"}
          />
          <BlueBtn
            onClick={() => {
              if (props.delete) {
                delCancel.current = "delete";
                timeline.current.reverse();
              }
            }}
            content="YES, DELETE"
            styles={"!bg-red"}
          />
        </div>
      </div>

      {/* Overlay */}
      <div
        onClick={() => {
          if (props.cancel) {
            // props.cancel();
            timeline.current.reverse();
          }
        }}
        className="bg-overlay overlay fixed w-full h-full z-[20] top-0 left-0"
      ></div>
    </>
  );
}
