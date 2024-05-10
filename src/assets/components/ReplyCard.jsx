import React, { useEffect, useRef, useState, useContext } from "react";
import reply from "/icon-reply.svg";
import del from "/icon-delete.svg";
import edit from "/icon-edit.svg";
import julius from "/julius.png";
import BlueBtn from "./BlueBtn";
import DeleteQuery from "./DeleteQuery";
import gsap from "gsap";
import { Context } from "../../App";

export default function ReplyCard(props) {
  const [currUser] = useContext(Context);
  const [isReply, setIsReply] = useState(props.isReply);
  const [replies, setReplies] = useState(props.replies);
  // const [isUser, setIsUser] = useState(props.username == currUser.username);
  const [currReply, setCurrReply] = useState(props.content);
  const [isreadOnly, setIsReadOnly] = useState(true);
  const [hasReplied, setHasReplied] = useState(true);
  const replyInpEl = useRef("");
  const [score, setScore] = useState(props.score);
  const [deleteModal, setDeleteModal] = useState(false);
  const [hasAddedReply, setHasAddedReply] = useState(false);
  const [replyingTo, setReplyingTo] = useState(props.replyingTo);
  const isUser = useRef(props.username == currUser.username);
  const cardEl = useRef(null);
  const textAreaRef = useRef(null);

  // }, [currUser]);
  function increaseScore() {
    if (score - props.score == 1) return;
    setScore(score + 1);
  }

  function decreaseScore() {
    if (score == 0) {
      return;
    }

    if (props.score - score == 1) return;

    setScore(score - 1);
  }

  function updateReplies(e) {
    e.preventDefault();
    setReplies((prev) => {
      return [
        ...prev,
        {
          user: {
            username: currUser.username,
            image: currUser.image,
          },
          content: currReply,
          score: 0,
          createdAt: "2 weeks",
          id: Math.random(),
          replyingTo: props.username,
          isReply: true,
        },
      ];
    });

    setHasReplied(true);

    setHasAddedReply(true);
  }

  const [username, setUsername] = useState("");
  const [originalReply, setOriginalReply] = useState("");

  function editReply(e, level) {
    setIsReadOnly(false);
    replyInpEl.current.style.cssText = "border: 1px solid hsl(238, 40%, 52%);";

    if (level == 2) {
      const value =
        e.currentTarget.parentElement.parentElement.parentElement.querySelector(
          ".editable-div"
        ).textContent;
      const copyusername =
        e.currentTarget.parentElement.parentElement.parentElement.querySelector(
          ".username"
        ).textContent;
      setUsername(copyusername);
      setOriginalReply(value);

      return;
    }
    const value =
      e.currentTarget.parentElement.parentElement.querySelector(
        "textarea"
      ).value;
    const copyusername =
      e.currentTarget.parentElement.parentElement.querySelector(
        ".username"
      ).textContent;

    setUsername(copyusername);
    setOriginalReply(value);
  }

  function updateEditedReply(e) {
    setIsReadOnly(true);

    replyInpEl.current.style.cssText = "border: none;";
    props.editedReplies(currReply, username, originalReply);
  }

  function getReplyToDelete(e, level) {
    setDeleteModal(true);

    if (level == 2) {
      const value =
        e.currentTarget.parentElement.parentElement.parentElement.querySelector(
          ".editable-div"
        ).textContent;
      const copyusername =
        e.currentTarget.parentElement.parentElement.parentElement.querySelector(
          ".username"
        ).textContent;
      setUsername(copyusername);
      setOriginalReply(value);

      return;
    }
    const value =
      e.currentTarget.parentElement.parentElement.querySelector(
        ".editable-div"
      ).textContent;

    const copyusername =
      e.currentTarget.parentElement.parentElement.querySelector(
        ".username"
      ).textContent;
    setUsername(copyusername);
    setOriginalReply(value);
  }

  //   This useEffect updates the replies and sends it to the commentCard component, to be used, which is sent to the App component
  useEffect(() => {
    isUser.current = props.username == currUser.username;

    if (replies.length == 0) return;
    props.replyReplies(
      replies.reverse(),
      [props.username, props.content],
      cardEl.current
    );
    props.hasAddedReply2(true);
  }, [replies, currUser]);

  //   This useEffect gets the combined replies of the ReplyCard and the CommentCard itself and sends it to the App component
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [hasReplied]);

  return (
    <>
      <div
        ref={cardEl}
        className={`flex flex-col gap-4 w-[80%] ${
          isReply
            ? "reply-reply-card"
            : "w-[80%] -950:w-[90%] -450:w-[95%] reply-comment-card"
        } self-end`}
      >
        <div className="flex flex-col w-full max-w-[1100px] justify-start items-end gap-8 bg-white shadow-sm p-6 rounded-lg relative">
          <div className="flex w-full justify-start items-center gap-8">
            {/* Container for vote count */}
            <div className="flex flex-col gap-1 bg-voteBg font-bold text-normalBlue text-lg items-center p-4 py-2 rounded-lg -650:hidden">
              <button
                onClick={increaseScore}
                className="text-2xl text-voteText"
              >
                +
              </button>
              <p className="font-medium">{score}</p>
              <button
                onClick={decreaseScore}
                className="text-2xl text-voteText"
              >
                -
              </button>
            </div>

            {/* Container for details and comment content */}
            <div className="flex flex-col w-full items-start gap-4">
              {/* Container for details */}
              <div className="flex flex-wrap items-center w-full justify-start gap-4 font-medium">
                <img src={props.image} className="max-w-[40px]" alt="" />
                <div className="text-deepBlue font-bold flex gap-2 justify-center items-center">
                  <p className="username"> {props.username}</p>
                  {isUser.current ? (
                    <p className="bg-normalBlue text-white px-1 rounded-sm">
                      you
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <p className="text-commentBlue">{props.createdAt}</p>
              </div>

              {/* Container for comment */}
              <div className="text-commentBlue w-full">
                {isUser.current ? (
                  <div
                    onChange={(e) => {
                      setCurrReply(e.currentTarget.value);
                    }}
                    contentEditable={!isreadOnly}
                    className={`editable-div w-full break-words p-3 rounded-md ${
                      isreadOnly
                        ? "focus:outline-none"
                        : "focus:outline-1 focus:outline-normalBlue"
                    }`}
                    ref={replyInpEl}
                  >
                    <span className="text-normalBlue font-semibold">
                      @{props.replyingTo}
                    </span>
                    <span> {props.content}</span>
                  </div>
                ) : (
                  <>
                    {" "}
                    <span className="text-normalBlue font-semibold">
                      @{props.replyingTo}
                    </span>
                    <span> {props.content}</span>
                  </>
                )}
              </div>
            </div>

            {/* This section either shows "reply" or "edit delete" depending on whether the reply belongs to the current user or not */}
            {isUser.current ? (
              <div className="absolute top-6 right-6 flex justify-center items-center gap-4 font-semibold -650:hidden">
                <button
                  onClick={getReplyToDelete}
                  className="flex items-center justify-center gap-1 text-red"
                >
                  <img src={del} alt="" /> Delete
                </button>
                <button
                  onClick={editReply}
                  className="flex items-center justify-center gap-1 text-normalBlue"
                >
                  <img src={edit} alt="" /> Edit
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  setHasReplied(false);
                  setCurrReply("");
                  // props.repliesOfReply(replies)
                }}
                className="text-normalBlue absolute top-6 right-6 flex items-center justify-center font-semibold gap-2 -650:hidden"
              >
                <img className="icon" src={reply} alt="" />
                <p>Reply</p>
              </button>
            )}
          </div>

          {/* This div contains the mobile view of the vote count and the reply, delete, edit buttons */}
          <div className="hidden -650:flex w-full justify-between">
            {/* Container for vote count */}
            <div className="flex gap-4 bg-voteBg font-bold text-normalBlue text-lg items-center p-4 py-2 rounded-lg">
              <button
                onClick={increaseScore}
                className="text-2xl text-voteText"
              >
                +
              </button>
              <p className="font-medium">{score}</p>
              <button
                onClick={decreaseScore}
                className="text-2xl text-voteText"
              >
                -
              </button>
            </div>

            {isUser.current ? (
              <div
                className={`flex justify-center items-center gap-4 font-semibold ${
                  !isreadOnly ? "hidden" : ""
                }`}
              >
                <button
                  onClick={(e) => {
                    getReplyToDelete(e, 2);
                  }}
                  className="flex items-center justify-center gap-1 text-red"
                >
                  <img src={del} alt="" /> Delete
                </button>
                <button
                  onClick={(e) => {
                    editReply(e, 2);
                  }}
                  className="flex items-center justify-center gap-1 text-normalBlue"
                >
                  <img src={edit} alt="" /> Edit
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setHasReplied(false);
                  setCurrReply("");
                  // props.repliesOfReply(replies)
                }}
                className="text-normalBlue flex items-center justify-center font-semibold gap-2"
              >
                <img className="icon" src={reply} alt="" />
                <p>Reply</p>
              </button>
            )}
          </div>

          {!isreadOnly ? (
            <BlueBtn content={"UPDATE"} onClick={updateEditedReply} />
          ) : (
            ""
          )}
        </div>

        {/* Section for replies if any */}
        {/* {replies.length > 0 ? (
        <div className="flex flex-col gap-4">
          {replies.map((reply) => {
            return (
              <ReplyCard
                key={reply.id}
                score={reply.score}
                username={reply.user.username}
                createdAt={reply.createdAt}
                content={reply.content}
                image={reply.user.image}
                replies={reply.replies ? [] : []}
                isReply={true}
                replyingTo={reply.replyingTo}
              />
            );
          })}
        </div>
      ) : (
        ""
      )} */}

        {/* This section shows the textarea a user types in their reply before it is sent */}
        {hasReplied ? (
          ""
        ) : (
          <form
            onSubmit={updateReplies}
            className="flex w-full bg-white rounded-lg p-4 gap-4 h-[200px] items-start"
          >
            <img src={currUser.image} className="max-h-[40px]" alt="" />
            <textarea
              onChange={(e) => {
                setCurrReply(e.currentTarget.value);
              }}
              className="w-full textAreaRef border-[1px] border-normalBlue outline-normalBlue break-all p-4 h-full leading-[1] rounded-md"
              type="text"
              placeholder="Add comment..."
              value={currReply}
              ref={textAreaRef}
            />

            <BlueBtn content={"REPLY"} />
          </form>
        )}
      </div>

      {deleteModal ? (
        <DeleteQuery
          el={cardEl.current}
          delete={() => {
            props.deletedReply(username, originalReply, replyingTo);
          }}
          cancel={() => {
            setDeleteModal(false);
          }}
        />
      ) : (
        ""
      )}
    </>
  );
}
