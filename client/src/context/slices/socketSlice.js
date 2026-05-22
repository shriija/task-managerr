export const createSocketSlice = (set, get) => ({
  setupSocket: (socket) => {
    if (!socket) return;

    socket.off("card-moved");
    socket.off("card-added");
    socket.off("card-updated");
    socket.off("card-deleted");
    socket.off("list-added");
    socket.off("list-updated");
    socket.off("list-deleted");
    socket.off("online-users");
    socket.off("board-updated");
    socket.off("member-updated");

    socket.on("card-moved", async (data) => {
      const { cardId, fromListId, toListId, newPosition } = data;
      const { lists } = get();
      const sourceList = lists.find(l => l._id === fromListId);
      if (!sourceList) return;
      const movedCard = sourceList.cards.find(c => c._id === cardId);
      if (!movedCard) return;

      let updatedLists = [...lists];
      updatedLists = updatedLists.map(l => {
        if (l._id === fromListId) {
          return { ...l, cards: l.cards.filter(c => c._id !== cardId) };
        }
        return l;
      });
      updatedLists = updatedLists.map(l => {
        if (l._id === toListId) {
          const cards = [...l.cards];
          cards.splice(newPosition, 0, { ...movedCard, list: toListId });
          return { ...l, cards };
        }
        return l;
      });

      set({ lists: updatedLists });
    });

    socket.on("card-added", (data) => {
      const { card, listId } = data;
      set({
        lists: get().lists.map(l =>
          l._id === listId ? { ...l, cards: [...(l.cards || []), card] } : l
        )
      });
    });

    socket.on("card-updated", (data) => {
      const { cardId, listId, updates, targetListId } = data;
      const destListId = targetListId || (updates && updates.list) || listId;
      const { lists } = get();
      let updatedLists = [...lists];

      if (listId !== destListId) {
        const sourceList = lists.find(l => l._id === listId);
        const movedCard = sourceList?.cards.find(c => c._id === cardId) || updates;
        
        updatedLists = updatedLists.map(l => {
          if (l._id === listId) {
            return { ...l, cards: l.cards.filter(c => c._id !== cardId) };
          }
          return l;
        });
        
        updatedLists = updatedLists.map(l => {
          if (l._id === destListId) {
            const alreadyExists = l.cards?.some(c => c._id === cardId);
            if (alreadyExists) {
              return { ...l, cards: l.cards.map(c => c._id === cardId ? { ...c, ...updates } : c) };
            }
            return { ...l, cards: [...(l.cards || []), { ...movedCard, ...updates }] };
          }
          return l;
        });
      } else {
        updatedLists = updatedLists.map(l =>
          l._id === listId
            ? {
                ...l,
                cards: l.cards.map(c =>
                  c._id === cardId ? { ...c, ...updates } : c
                )
              }
            : l
        );
      }
      set({ lists: updatedLists });
    });

    socket.on("card-deleted", (data) => {
      const { cardId, listId } = data;
      set({
        lists: get().lists.map(l =>
          l._id === listId
            ? { ...l, cards: l.cards.filter(c => c._id !== cardId) }
            : l
        )
      });
    });

    socket.on("list-added", (data) => {
      const { list } = data;
      set({ lists: [...get().lists, { ...list, cards: [] }] });
    });

    socket.on("list-updated", (data) => {
      const { listId, title } = data;
      set({
        lists: get().lists.map(l =>
          l._id === listId ? { ...l, title } : l
        )
      });
    });

    socket.on("list-deleted", (data) => {
      const { listId } = data;
      set({ lists: get().lists.filter(l => l._id !== listId) });
    });

    socket.on("online-users", (users) => {
      set({ onlineUsers: users });
    });

    socket.on("board-updated", (data) => {
      if (data.board) {
        set({ board: data.board });
      }
    });

    socket.on("member-updated", (data) => {
      if (data.board) {
        set({ board: data.board });
      }
    });
  }
});
