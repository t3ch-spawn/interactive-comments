import React, { useEffect, useState, useRef, useContext } from "react";
import reply from "/icon-reply.svg";
import ReplyCard from "./ReplyCard";
import del from "/icon-delete.svg";
import edit from "/icon-edit.svg";
import julius from "/julius.png";
import BlueBtn from "./BlueBtn";
import DeleteQuery from "./DeleteQuery";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { Context } from "../../App";

export default function CommentCard(props) {
  const [currUser] = useContext(Context);
  const [score, setScore] = useState(props.score);
  const [replies, setReplies] = useState(props.replies);
  const [hasReplied, setHasReplied] = useState(true);
  const [currComment, setCurrComment] = useState(props.content);
  const [isreadOnly, setIsReadOnly] = useState(true);
  const commentInpEl = useRef("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [hasAddedReply, setHasAddedReply] = useState(false);
  const [hasAddedReply2, setHasAddedReply2] = useState(false);
  const commentCardEl = useRef(null);
  const replyCardEl = useRef(null);
  const repliesOfreply = useRef(null);
  const isUser = useRef(props.username == currUser.username);
  const textAreaRef = useRef(null);

  function increaseScore() {
    setScore(score + 1);
  }

  function decreaseScore() {
    if (score == 0) {
      return;
    }
    setScore(score - 1);
  }

  function updateReplies(e) {
    e.preventDefault();
    setHasReplied(true);
    setReplies((prev) => {
      return [
        ...prev,
        {
          user: {
            username: currUser.username,
            image: currUser.image,
          },
          content: currComment,
          score: 3,
          createdAt: "2 weeks",
          id: replies.length + 8,
          replyingTo: props.username,
          isReply: false,
        },
      ];
    });

    setHasAddedReply(true);
  }
  const [username, setUsername] = useState("");
  const [originalComment, setOriginalComment] = useState("");

  function editComment(e, level) {
    setIsReadOnly(false);
    commentInpEl.current.style.cssText =
      "border: 1px solid hsl(238, 40%, 52%);";

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
      setOriginalComment(value);

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
    setOriginalComment(value);
  }

  function updateEditedComment() {
    setIsReadOnly(true);

    commentInpEl.current.style.cssText = "border: none;";
    props.editedComment(currComment, username, originalComment);
  }

  function getReplies(newReplies, [username, content], replyEl) {
    repliesOfreply.current = newReplies;
    // console.log(newReplies);
    const repliedReply = replies.find((reply) => {
      return reply.content == content && reply.user.username == username;
    });

    if (!repliedReply) return;

    replyCardEl.current = replyEl;
    const idxOfReply = replies.indexOf(repliedReply);
    const arrayCopy = [...replies];
    // const arrayCopy2 = [...replies]
    // arrayCopy.splice(idxOfReply, newReplies.length);
    // const newRecentReplies = [repliedReply]
    //   .concat(newReplies)
    //   .concat(arrayCopy);
    // setReplies(newRecentReplies);
    // console.log(newReplies);
    // const mostRecentReplies = arrayCopy
    //   .map((reply) => {
    //     if (reply == repliedReply) {
    //       return [repliedReply, newReplies];
    //     } else if (newReplies.includes(reply)) {
    //       return "";
    //     } else {
    //       return reply;
    //     }
    //   })
    //   .flat(2)
    //   .filter((reply) => {
    //     return reply !== "";
    //   });

    // const mostRecentReplies = new Set(
    //   arrayCopy
    //     .map((reply) => {
    //       if (reply == repliedReply) {
    //         return [repliedReply, newReplies[0]];
    //       } else {
    //         return reply;
    //       }
    //     })
    //     .flat(2)
    //     .filter((reply) => {
    //       return reply !== "";
    //     })
    // );

    if (!replies.includes(newReplies[0])) {
      arrayCopy.splice(idxOfReply + 1, 0, newReplies[0]);
    }
    // console.log(arrayCopy);
    setReplies(arrayCopy);

    // Stops card animation from playing when the replies array updates
    setHasAddedReply(false);
    setHasAddedReply2(false);
  }

  function getEditedReplies(editedContent, username, content) {
    const foundReply = replies.find((reply) => {
      return reply.content == content && reply.user.username == username.trim();
    });

    const copyReply = { ...foundReply };
    copyReply.content = editedContent;

    setReplies((prev) => {
      return prev.map((reply) => {
        if (reply == foundReply) {
          return copyReply;
        } else {
          return reply;
        }
      });
    });

    // Stops card animation from playing when the replies array updates
    setHasAddedReply(false);
    setHasAddedReply2(false);
  }

  function getCommentToDelete(e, level) {
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
      setOriginalComment(value);

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
    setOriginalComment(value);
  }

  function getDeletedReply(username, content, replyingTo) {
    // console.log(username, content);
    // console.log(username);
    const actualContent = content.replace(`@${replyingTo}`, "");
    const foundReply = replies.find((reply) => {
      return (
        reply.content == actualContent.trim() &&
        reply.user.username == username.trim()
      );
    });

    //   If you cannot find the reply, don't delete anything
    if (!foundReply) return;

    const idx = replies.indexOf(foundReply);
    const copyAllReplies = [...replies];
    copyAllReplies.splice(idx, 1);
    setReplies(copyAllReplies);
    // Stops card animation from playing when the replies array updates
    setHasAddedReply(false);
    setHasAddedReply2(false);
  }

  //   This useEffect gets the combined replies of the ReplyCard and the CommentCard itself and sends it to the App component
  useEffect(() => {
    isUser.current = props.username == currUser.username;

    if (!replies) return;
    props.commentReplies(replies, [props.username, props.content]);
    gsap.set(".comment-card", { x: 0 });
  }, [replies, currUser]);

  gsap.registerPlugin(ScrollToPlugin);
  //   This useEffect animates the latest reply into the page
  useEffect(() => {
    if (!hasAddedReply) return;
    const cardsEls = commentCardEl.current.querySelectorAll(
      ".reply-comment-card"
    );
    const cards = gsap.utils.toArray(cardsEls);
    gsap.set(cards.at(-1), { opacity: 0 });
    gsap.to(window, {
      duration: 0.2,
      scrollTo: {
        y: cards.at(-1),
        offsetY: 200,
      },

      onComplete: () => {
        gsap.from(cards.at(-1), {
          x: -100,
          ease: "back.out(4)",
          duration: 0.4,
        });
        gsap.to(cards.at(-1), {
          opacity: 1,
        });

        setHasAddedReply(false);
      },
    });
  }, [replies]);

  function hasAddedReplyFn(state) {
    setHasAddedReply2(state);
    setHasAddedReply(false);
  }

  useEffect(() => {
    if (!hasAddedReply2 || hasAddedReply == true) return;
    const allReplyCards = Array.from(
      replyCardEl.current.parentElement.children
    );

    let hasReachedReply = false;
    // console.log(repliesOfreply);
    // This mapping gets the reply cards just after a reply that was clicked
    const cardsEls = allReplyCards
      .map((card) => {
        if (card == replyCardEl.current) {
          hasReachedReply = true;
          return "";
        } else if (hasReachedReply == false) {
          return "";
        } else if (
          hasReachedReply &&
          card.classList.contains("reply-reply-card")
        ) {
          return card;
        } else if (
          hasReachedReply &&
          !card.classList.contains("reply-reply-card")
        ) {
          hasReachedReply = false;
          return "";
        }
      })
      .filter((card) => {
        return card != "";
      });

    // const cardsEls = replyCardEl.current.querySelectorAll(".reply-reply-card");
    const cards = gsap.utils.toArray(cardsEls);

    gsap.set(cards.at(0), { opacity: 0 });
    gsap.to(window, {
      duration: 0.2,
      scrollTo: {
        y: cards.at(0),
        offsetY: 200,
      },

      onComplete: () => {
        gsap.from(cards.at(0), {
          x: -100,
          ease: "back.out(4)",
          duration: 0.4,
        });
        gsap.to(cards.at(0), {
          opacity: 1,
        });

        setHasAddedReply2(false);
      },
    });
  }, [replies]);

  // This useEffect focuses the textArea once the "reply" button has been clicked
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [hasReplied]);

  return (
    <div ref={commentCardEl} className="flex flex-col gap-4 w-full">
      <div className="comment-card flex flex-col w-full max-w-[1100px] justify-end items-end gap-8 bg-white shadow-sm p-6 rounded-lg relative">
        <div className="flex w-full justify-start items-center gap-8">
          {/* Container for vote count */}
          <div className="-650:hidden flex flex-col gap-1 bg-voteBg font-bold text-normalBlue text-lg items-center p-4 py-2 rounded-lg">
            <button onClick={increaseScore} className="text-2xl text-voteText">
              +
            </button>
            <p className="font-medium">{score}</p>
            <button onClick={decreaseScore} className="text-2xl text-voteText">
              -
            </button>
          </div>

          {/* Container for details and comment content */}
          <div className="flex flex-col w-full items-start gap-4">
            {/* Container for details */}
            <div className="flex items-center flex-wrap justify-left gap-4 font-medium">
              <img src={props.image} className="max-w-[40px]" alt="" />
              <div className="text-deepBlue font-bold flex gap-2 justify-center items-center">
                <p className="username">{props.username}</p>
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
                  ref={commentInpEl}
                >
                  <span> {props.content}</span>
                </div>
              ) : (
                props.content
              )}
            </div>
          </div>
        </div>

        {/* This section either shows "reply" or "edit delete" depending on whether the reply belongs to the current user or not */}
        {isUser.current ? (
          <div className="absolute top-8 right-6 flex justify-center items-center gap-4 font-semibold -650:hidden">
            <button
              onClick={getCommentToDelete}
              className="flex items-center justify-center gap-1 text-red"
            >
              <img src={del} alt="" /> Delete
            </button>
            <button
              onClick={editComment}
              className="flex items-center justify-center gap-1 text-normalBlue"
            >
              <img src={edit} alt="" /> Edit
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setHasReplied(false);
              setCurrComment("");
            }}
            className="text-normalBlue absolute top-8 right-6 flex items-center justify-center font-semibold gap-2 -650:hidden"
          >
            <img className="icon" src={reply} alt="" />
            <p>Reply</p>
          </button>
        )}

        {!isreadOnly ? (
          <BlueBtn content={"UPDATE"} onClick={updateEditedComment} />
        ) : (
          ""
        )}

        {/* This div contains the mobile view of the vote count and the reply, delete, edit buttons */}
        <div className="hidden -650:flex w-full justify-between">
          {/* Container for vote count */}
          <div className="flex gap-4 bg-voteBg font-bold text-normalBlue text-lg items-center p-4 py-2 rounded-lg">
            <button onClick={increaseScore} className="text-2xl text-voteText">
              +
            </button>
            <p className="font-medium">{score}</p>
            <button onClick={decreaseScore} className="text-2xl text-voteText">
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
                  getCommentToDelete(e, 2);
                }}
                className="flex items-center justify-center gap-1 text-red"
              >
                <img src={del} alt="" /> Delete
              </button>
              <button
                onClick={(e) => {
                  editComment(e, 2);
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
                setCurrComment("");
                // props.repliesOfReply(replies)
              }}
              className="text-normalBlue flex items-center justify-center font-semibold gap-2"
            >
              <img className="icon" src={reply} alt="" />
              <p>Reply</p>
            </button>
          )}
        </div>
      </div>

      {/* This section shows the textarea a user types in their reply before it is sent */}
      {hasReplied ? (
        ""
      ) : (
        <form
          onSubmit={updateReplies}
          className="flex w-[80%] self-end bg-white rounded-lg p-4 gap-4 h-[200px] items-start"
        >
          <img src={currUser.image} className="max-h-[40px]" alt="" />
          <textarea
            onChange={(e) => {
              setCurrComment(e.currentTarget.value);
            }}
            className="w-full border-[1px] border-normalBlue outline-normalBlue break-all p-4 h-full leading-[1] rounded-md"
            type="text"
            placeholder="Add comment..."
            value={currComment}
            ref={textAreaRef}
          />

          <BlueBtn content={"REPLY"} />
        </form>
      )}

      {/* Section for replies if any */}

      {replies && replies.length > 0 ? (
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
                isReply={reply.isReply}
                replyReplies={getReplies}
                editedReplies={getEditedReplies}
                deletedReply={getDeletedReply}
                replyingTo={reply.replyingTo}
                hasAddedReply2={hasAddedReplyFn}
                currUser={currUser}
              />
            );
          })}
        </div>
      ) : (
        ""
      )}

      {deleteModal ? (
        <DeleteQuery
          el={commentCardEl.current}
          delete={() => {
            props.deletedComment(username, originalComment);
          }}
          cancel={() => {
            setDeleteModal(false);
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
}
