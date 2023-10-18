"use client";

import modalStore from "@/stores/modalStore";
import toastStore from "@/stores/toastStore";
import userStore from "@/stores/userStore";
import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import AdvacncedSettings from "../settings/AdvacncedSettings";

const EditModal = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [bodyContent, setBodyContent] = useState(0);

  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const profileImageRef = useRef(null);
  const coverImageRef = useRef(null);

  const loggedUser = userStore((state) => state.loggedUser);
  const closeEditModal = modalStore((state) => state.closeEditModal);
  const addToast = toastStore((state) => state.addToast);

  const router = useRouter();

  // console.log(loggedUser, " loggeduser");

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if ((oldPassword && !newPassword) || (newPassword && !oldPassword)) {
        alert("need both passwordds");
      }
      try {
        setIsLoading(true);

        const postBody = {
          ...(name && name != loggedUser?.name ? { name } : {}),
          ...(bio && bio != loggedUser?.bio ? { bio } : {}),
          ...(profileImage && profileImage != loggedUser?.profileImage
            ? { profileImage }
            : {}),
          ...(coverImage && coverImage != loggedUser?.coverImage
            ? { coverImage }
            : {}),
          ...(oldPassword ? { oldPassword } : {}),
          ...(newPassword ? { newPassword } : {}),
        };

        if (!Object.keys(postBody).length) return;

        const res = await axios.post("/api/edit", postBody);

        // console.log(res);

        if (res?.status !== 200) {
          throw new Error(res?.error);
        }

        setProfileImage(null);
        setCoverImage(null);

        addToast("Updated succesfully");

        // if (res?.data?.login) {
        //   await signOut();
        // }

        closeEditModal();
        router.refresh();
      } catch (error) {
        console.log(error);
        addToast(error?.response?.data?.error || "something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [name, oldPassword, newPassword, bio, profileImage, coverImage, router]
  );

  const handleImageUpload = useCallback(
    (e, type) => {
      const file = e.target.files[0];

      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          type === "profile"
            ? setProfileImage(reader.result)
            : setCoverImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        type === "profile" ? setProfileImage(null) : setCoverImage(null);
        alert("Please select a valid image file.");
      }
    },
    [profileImage, coverImage]
  );

  const resetInputBox = useCallback((type) => {
    switch (type) {
      case "profile":
        if (profileImageRef.current)
          profileImageRef.current.files = new DataTransfer().files;
        break;
      case "cover":
        if (coverImageRef.current)
          coverImageRef.current.files = new DataTransfer().files;
        break;

      default:
        break;
    }
  }, []);

  const resetFields = useCallback(() => {
    setCoverImage(null);
    setProfileImage(null);
    resetInputBox("profile");
    resetInputBox("cover");
    setName(loggedUser?.name || "");
    setBio(loggedUser?.bio || "");
  }, [loggedUser]);

  const textTabContent = (
    <div className="w-full h-full ">
      <div className="w-full h-full flex flex-col gap-2">
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered w-full "
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="username"
            className="input input-bordered w-full "
            value={loggedUser?.username || ""}
            disabled={true}
          />
        </div>
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="username"
            className="input input-bordered w-full "
            value={loggedUser?.email || ""}
            disabled={true}
          />
        </div>

        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text">Bio</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );

  const mediaTabContent = (
    <>
      <div className="flex flex-row gap-4 mt-2 p-2">
        <div className="w-full flex flex-col gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Profile image</span>
            </label>
            <input
              ref={profileImageRef}
              type="file"
              accept="image/jpeg, image/png"
              onChange={(e) => handleImageUpload(e, "profile")}
              className="file-input file-input-bordered file-input-accent w-full max-w-xs"
            />
          </div>

          <div
            className={`h-24 w-full border-2 border-dotted relative ${
              profileImage ? "" : "opacity-25"
            }`}
          >
            <XMarkIcon
              className="w-6 h-6 absolute right-2 top-2 btn btn-circle btn-xs cursor-pointer p-1 btn-accent z-50"
              role="button"
              disabled={!profileImage}
              onClick={() => {
                setProfileImage(null);
                resetInputBox("profile");
              }}
            />
            {profileImage && (
              <Image
                src={profileImage}
                fill
                objectFit="contain"
                className="p-1"
                alt="profile image"
              />
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Cover image</span>
            </label>
            <input
              ref={coverImageRef}
              type="file"
              accept="image/jpeg, image/png"
              onChange={(e) => handleImageUpload(e, "cover")}
              className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
            />
          </div>
          <div
            className={`h-24 w-full border-2 border-dotted relative ${
              coverImage ? "" : "opacity-25"
            }`}
          >
            <XMarkIcon
              className="w-6 h-6 absolute right-2 top-2 btn btn-circle btn-xs cursor-pointer p-1 btn-secondary z-50"
              role="button"
              disabled={!coverImage}
              onClick={() => {
                setCoverImage(null);
                resetInputBox("cover");
              }}
            />
            {coverImage && (
              <Image
                src={coverImage}
                fill
                objectFit="contain"
                className="p-1"
                alt="cover image"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );

  const passwordTabContent = (
    <div className="flex flex-col gap-4">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">currrent password</span>
        </label>
        <input
          type="text"
          placeholder="current password"
          className="input input-bordered w-full "
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">New password</span>
        </label>
        <input
          type="text"
          placeholder="new password"
          className="input input-bordered w-full "
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
    </div>
  );

  const advancedTabContent = (
    <div className="w-full h-full ">
      <div className="w-full h-full flex flex-col gap-2">
        <AdvacncedSettings
          username={loggedUser?.username || ""}
          email={loggedUser?.email || ""}
        />
      </div>
    </div>
  );

  const contents = [
    textTabContent,
    mediaTabContent,
    passwordTabContent,
    advancedTabContent,
  ];

  useEffect(() => {
    setName(loggedUser?.name || "");
    setName(loggedUser?.name || "");
    setBio(loggedUser?.bio || "");
    // setProfileImage(loggedUser?.profileImage || null);
    // setCoverImage(loggedUser?.coverImage || null);
  }, [loggedUser]);

  return (
    <div>
      <dialog
        id="editModal"
        className="modal h-full w-full  flex justify-center items-center"
      >
        <form
          method="dialog"
          className="modal-box  md:max-w-2xl  w-[95%] flex items-center flex-col overflow-x-hidden transition-all h-fit"
        >
          <div className="right-2 top-2 h-auto py-2 flex justify-end items-center w-full -mt-4 ">
            <button
              className="btn btn-md btn-circle btn-ghost"
              disabled={isLoading}
              onClick={resetFields}
            >
              <XCircleIcon className="w-8 h-8" />
            </button>
          </div>
          <div className="h-full w-full flex flex-col gap-2 justify-evenly">
            <main className=" transition-[height] duration-75 ease-in-out overflow-y-auto">
              <div className="tabs tabs-boxed mb-3 p-2">
                {["Info", "Media", "Password", "Advanced"].map(
                  (value, index) => (
                    <span
                      key={value}
                      className={`font-medium tab ${
                        bodyContent === index ? "tab-active" : ""
                      }`}
                      onClick={() => setBodyContent(index)}
                    >
                      {value}
                    </span>
                  )
                )}
              </div>
              <AnimatePresence mode="await">
                <motion.div
                  layout
                  className=""
                  key={bodyContent}
                  initial={{
                    opacity: 0,
                    height: 0,
                    zIndex: 99999,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    zIndex: 9999,
                    transition: {
                      duration: 0.5,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    zIndex: 0,
                    transition: {
                      duration: 0.3,
                      height: {
                        stiffness: 1000,
                        velocity: 100,
                      },
                    },
                  }}
                >
                  {!loggedUser?.id ? (
                    <div className=" w-full flex justify-center items-center">
                      <span className="loading loading-spinner text-primary p-4"></span>
                    </div>
                  ) : (
                    contents[bodyContent]
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex justify-center items-center relative ">
                <button
                  className="btn btn-primary text-primary-content w-full "
                  onClick={handleSubmit}
                  disabled={
                    (oldPassword && !newPassword) ||
                    (newPassword && !oldPassword) ||
                    isLoading ||
                    !loggedUser?.id ||
                    bodyContent > 2
                  }
                >
                  submit
                </button>
              </div>
            </main>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default EditModal;
