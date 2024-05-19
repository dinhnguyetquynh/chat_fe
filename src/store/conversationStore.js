import {create} from 'zustand';

const conversationStore = create((set) => ({
    conversation: null,
    setConversation: (conversation) => set(() => ({conversation: conversation})),
    UnSetConversation: () => set(() => ({conversation: null})),
}));

export default conversationStore;
