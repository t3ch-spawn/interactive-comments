import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import rawData from "./assets/data.json";
import robson from "/robson.png";
import julius from "/julius.png";
import max from "/max.png";
import ramses from "/ramses.png";
import CommentCard from "./assets/components/CommentCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/all";
import profile from "/profile.svg";
import UserTransition from "./assets/components/UserTransition";

export const Context = React.createContext();

function App() {
  const [count, setCount] = useState(0);
  const [currComment, setCurrComment] = useState("");
  const [allComments, setAllComments] = useState(rawData.comments);
  const avatars = [robson, max];
  const [hasAddedComment, setHasAddedComment] = useState(false);
  const [currUser, setCurrUser] = useState({
    image: max,
    username: "maxblagun",
  });
  const tempUser = useRef({});
  const avatarAnimated = useRef(false);

  useEffect(() => {
    if (allComments[0]) allComments[0].user.image = robson;
    if (allComments[1]) allComments[1].user.image = max;
    if (allComments[1].replies[0])
      allComments[1].replies[0].user.image = ramses;
    if (allComments[1].replies[1])
      allComments[1].replies[1].user.image = julius;
  }, []);

  function getCommentReplies(commentReply, commentDetails) {
    // console.log(commentReply);
    // console.log(commentDetails);
    const theComment = allComments.find((foundComment) => {
      return (
        foundComment.user.username == commentDetails[0] &&
        foundComment.content == commentDetails[1]
      );
    });

    const updatedComment = { ...theComment };
    updatedComment.replies = commentReply;
    // console.log(theComment);
    // console.log(updatedComment);

    setAllComments((prev) => {
      return prev.map((comment) => {
        if (comment == theComment) {
          return updatedComment;
        } else {
          return comment;
        }
      });
    });

    // Stops card animation from playing when the comments update
    setHasAddedComment(false);

    return [theComment, updatedComment];
  }

  function getEditedComment(editedContent, username, content) {
    const foundComment = allComments.find((comment) => {
      return (
        comment.content == content && comment.user.username == username.trim()
      );
    });

    const copyComment = { ...foundComment };
    copyComment.content = editedContent;

    setAllComments((prev) => {
      return prev.map((comment) => {
        if (comment == foundComment) {
          return copyComment;
        } else {
          return comment;
        }
      });
    });
    // Stops card animation from playing when the comments update
    setHasAddedComment(false);
  }

  function getDeletedComment(username, content) {
    const foundComment = allComments.find((comment) => {
      return (
        comment.content == content && comment.user.username == username.trim()
      );
    });

    // If you cannot find the comment, dont delete anything
    if (!foundComment) return;

    const idx = allComments.indexOf(foundComment);
    const copyAll = [...allComments];
    copyAll.splice(idx, 1);
    setAllComments(copyAll);

    // Stops card animation from playing when the comments update
    setHasAddedComment(false);
  }

  const commentEls = allComments.map((comment) => {
    return (
      <CommentCard
        key={comment.id}
        score={comment.score}
        username={comment.user.username}
        createdAt={comment.createdAt}
        content={comment.content}
        image={comment.user.image}
        replies={comment.replies}
        commentReplies={getCommentReplies}
        editedComment={getEditedComment}
        deletedComment={getDeletedComment}
        animated={true}
        user={currUser}
      />
    );
  });

  function updateComments(e) {
    e.preventDefault();

    setAllComments((prev) => {
      return [
        ...prev,
        {
          user: {
            username: currUser.username,
            image: currUser.image,
          },
          content: currComment,
          score: 0,
          createdAt: "2 weeks",
          id: allComments.length + 1,
          replies: [],
        },
      ];
    });

    setCurrComment("");

    setHasAddedComment(true);
  }

  // This useEffect does the gsap animation when a comment is added
  useEffect(() => {
    if (!hasAddedComment) return;
    const cards = gsap.utils.toArray(".comment-card");

    gsap.from(cards.at(-1), {
      x: 100,
      ease: "back.out(4)",
      duration: 0.4,
    });
  }, [allComments]);

  // console.log(allComments);
  gsap.registerPlugin(MotionPathPlugin);

  useGSAP(() => {
    gsap.set(".avatar", { opacity: 0 });

    gsap.to(".profile-icon-cont", {
      duration: 0.5,
      y: -10,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  });

  function resetAvatars() {
    const avatars = gsap.utils.toArray(".avatar");

    if (!avatarAnimated.current) {
      avatarAnimated.current = true;

      gsap.to(".avatar-overlay", {
        duration: 2,
        scale: 300,
      });

      avatars.forEach((avatar, idx, array) => {
        gsap.to(avatar, {
          opacity: 1,
          duration: 0.8,
          delay: idx * 0.1,
          motionPath: {
            path: "#path",
            start: 0,
            autoRotate: true,
            align: "#path",
            end: (idx + 1) / array.length,
          },
        });
      });
    } else {
      avatarAnimated.current = false;

      // gsap.to(".avatar-overlay", {
      //   scale: 0,
      //   duration: 0.8,
      // });
      avatars.forEach((avatar, idx, array) => {
        gsap.to(avatar, {
          opacity: 0,
          duration: 0.8,
          delay: idx * 0.1,
          motionPath: {
            path: "#path",
            start: (idx + 1) / array.length,
            autoRotate: true,
            align: "#path",
            end: 0,
          },
        });
      });
    }
  }

  const transitionFunc = useRef(null);

  function performTransition() {
    if (transitionFunc.current) {
      transitionFunc.current();
    }
  }

  function getTransitionFunc(thefunc) {
    transitionFunc.current = thefunc;
  }

  return (
    <Context.Provider value={[currUser, setCurrUser]}>
      <>
        <UserTransition
          transitionFunc={getTransitionFunc}
          img={tempUser.current.image}
          name={tempUser.current.username}
        />
        <main className="all-container relative flex flex-col gap-3 justify-center items-center w-full max-w-[1100px] mx-auto">
          {commentEls}

          {/* Container for comment box */}
          <form
            onSubmit={updateComments}
            className="flex -650:flex-col w-full bg-white rounded-lg p-4 gap-4 h-[200px] items-start"
          >
            <img
              src={currUser.image}
              className="max-h-[40px] -650:hidden"
              alt=""
            />
            <textarea
              onChange={(e) => {
                setCurrComment(e.currentTarget.value);
              }}
              className="w-full border-[1px] border-normalBlue outline-normalBlue break-all p-4 h-full leading-[1] rounded-md"
              type="text"
              placeholder="Add comment..."
              value={currComment}
            />
            <button className="bg-normalBlue text-white p-4 rounded-lg font-medium -650:hidden">
              SEND
            </button>

            <div className="hidden -650:flex w-full justify-between">
              <img src={currUser.image} className="max-h-[40px]" alt="" />

              <button className="bg-normalBlue text-white p-4 rounded-lg font-medium ">
                SEND
              </button>
            </div>
          </form>
        </main>
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="fixed bottom-[0px] left-[40px] scale-[1.3] opacity-0 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />

          <path
            id="path"
            d="M 100 50
           A 50 50 0 1 1 100 150
           A 50 50 0 1 1 100 50"
            fill="none"
            stroke="red"
            strokeWidth="2"
          />
        </svg>
        <div className={`avatar-overlay scale-0`}></div>
        <div>
          <div
            className="avatar"
            onClick={(e) => {
              resetAvatars();
              tempUser.current = { image: robson, username: "amyrobson" };
              performTransition();
            }}
          >
            <img src={robson} alt="" />
          </div>
          <div
            className="avatar"
            onClick={(e) => {
              resetAvatars();
              tempUser.current = { image: max, username: "maxblagun" };
              performTransition();
            }}
          >
            <img src={max} alt="" />
          </div>
          <div
            className="avatar"
            onClick={(e) => {
              resetAvatars();
              tempUser.current = { image: julius, username: "juliusomo" };
              performTransition();
            }}
          >
            <img src={julius} alt="" />
          </div>
          <div
            className="avatar"
            onClick={(e) => {
              resetAvatars();
              tempUser.current = { image: ramses, username: "ramsesmiron" };
              performTransition();
            }}
          >
            <img src={ramses} alt="" />
          </div>
        </div>
        <button
          onClick={resetAvatars}
          className="bg-normalBlue profile-icon-cont h-[40px] w-[40px] flex justify-center items-center text-white fixed bottom-[10px] left-[10px] rounded-[50%]"
        >
          <img className="profile-icon" src={profile} alt="" />
        </button>
      </>
    </Context.Provider>
  );
}

export default App;
