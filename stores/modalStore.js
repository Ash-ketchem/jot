import { create } from "react-nuance";

const modalStore = create((set) => ({
  openJotModal: () => window.jotModal.showModal(),
  openCommentModal: () => window.commentModal.showModal(),
  openDeletePostModal: () => window.deletePostModal.showModal(),
  openEditModal: () => window.editModal.showModal(),
  openSearchModal: () => window.searchModal.showModal(),

  closeJotModal: () => window.jotModal.close(),
  closeCommentModal: () => window.commentModal.close(),
  closeDeletePostModal: () => window.deletePostModal.close(),
  closeEditModal: () => window.editModal.close(),
  closeSearchModal: () => window.searchModal.close(),
}));

export default modalStore;
