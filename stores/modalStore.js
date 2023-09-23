import { create } from "react-nuance";

const modalStore = create((set) => ({
  openJotModal: () => window.jotModal.showModal(),
  openCommentModal: () => window.commentModal.showModal(),
  openDeletePostModal: () => window.deletePostModal.showModal(),
  openEditModal: () => window.editModal.showModal(),

  closeJotModal: () => window.jotModal.close(),
  closeCommentModal: () => window.commentModal.close(),
  closeDeletePostModal: () => window.deletePostModal.close(),
  closeEditModal: () => window.editModal.close(),
}));

export default modalStore;
