import React, { useRef, useEffect, useContext, useState } from "react";
import { useGSAP } from "@gsap/react";
import max from "/max.png";
import gsap from "gsap";
import { Context } from "../../App";

export default function UserTransition(props) {
  const [currUser, setCurrUser] = useContext(Context);
  const [setter, setSetter] = useState(1);
  function func() {
    gsap.set(".trans-img", { opacity: 1, y: 0 });
    gsap.set(".trans-name", { opacity: 1, y: 0 });

    gsap
      .timeline()
      .to(".trans-bg", {
        scaleY: 1,
        transformOrigin: "bottom",
        ease: "power3.in",
        duration: 0.8,
        onComplete: () => {
          gsap.to(".avatar-overlay", {
            scale: 0,
            duration: 0,
          });

          setCurrUser({
            image: props.img,
            username: props.name,
          });

          setSetter(setter + 1);
        },
      })
      .from(".trans-img", {
        delay: 0.2,
        opacity: 0,
        y: 100,
        scale: 0.5,
        rotate: 180,
        duration: 1,
        ease: "back.out(4)",
      })
      .from(".trans-name", {
        opacity: 0,
        delay: -0.4,
        y: 50,
      })
      .to(".trans-name", {
        delay: 0.3,
        y: "500%",
        opacity: 0,
        onStart: () => {
          gsap.to(".trans-img", {
            y: "-500%",
            opacity: 0,
          });
        },
      })
      .to(".trans-bg", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "power3.in",
        duration: 0.8,
      });
  }

  const myFunction = useRef(func);

  props.transitionFunc(myFunction.current);

  useEffect(() => {
    setCurrUser({
      image: props.img,
      username: props.name,
    });
  }, [setter]);

  return (
    <div className="trans-bg fixed top-0 left-0 w-full h-full bg-normalBlue z-[300] scale-1 flex flex-col gap-5 justify-center items-center scale-y-0">
      <img className="trans-img " src={props.img} alt="" />
      <p className="text-white text-2xl trans-name ">{props.name}</p>
    </div>
  );
}
