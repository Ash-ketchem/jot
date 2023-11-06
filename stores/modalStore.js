import { create } from "react-nuance";

const modalStore = create((set) => ({
  openJotModal: () => window.jotModal.showModal(),
  openCommentModal: () => window.commentModal.showModal(),
  openDeletePostModal: () => window.deletePostModal.showModal(),
  openEditModal: () => window.editModal.showModal(),
  openSearchModal: () => window.searchModal.showModal(),
  openTimerModal: () => window.timerModal.showModal(),
  openBreakModal: () => window.breakModal.showModal(),
  openImageModal: () => window.imageModal.showModal(),
  openStoriesModal: () => window.storiesModal.showModal(),
  openStoriesCarouselModal: () => window.StoriesCarouselModal.showModal(),

  closeJotModal: () => window.jotModal.close(),
  closeCommentModal: () => window.commentModal.close(),
  closeDeletePostModal: () => window.deletePostModal.close(),
  closeEditModal: () => window.editModal.close(),
  closeSearchModal: () => window.searchModal.close(),
  closeTimerModal: () => window.timerModal.close(),
  closeBreakModal: () => window.breakModal.close(),
  closeImageModal: () => window.imageModal.close(),
  closeStoriesModal: () => window.storiesModal.close(),
  closeStoriesCarouselModal: () => window.StoriesCarouselModal.close(),
}));

export default modalStore;
