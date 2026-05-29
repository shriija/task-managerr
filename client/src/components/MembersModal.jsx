import { useState, useRef, useEffect } from "react";
import { useBoardStore } from "../context/BoardContext";
import { useAuthStore } from "../context/AuthContext";

/**
 * MembersModal Component
 * 
 * Displays a modal listing all members of the board (Owner, Admins, and Members).
 * Provides controls for the board owner to promote/demote/remove members, and for admins
 * to remove regular members. 
 *
 * @param {Object} props
 * @param {Function} props.onClose - Callback to close the modal.
 */
function MembersModal({ onClose }) {
  const board = useBoardStore(s => s.board);
  const manageBoardMember = useBoardStore(s => s.manageBoardMember);
  const handleJoinRequest = useBoardStore(s => s.handleJoinRequest);
  const currentUser = useAuthStore(s => s.currentUser);
  
  const backdropRef = useRef(null);
  const [error, setError] = useState("");
  // Track which specific member and action is currently loading to disable buttons properly
  const [loadingId, setLoadingId] = useState("");

  const ownerId = board?.owner?._id || board?.owner;
  const isOwner = currentUser?._id === ownerId;
  const isAdmin = board?.admins?.some(admin => (admin._id || admin) === currentUser?._id);

  // Group all members: Board owner + board members
  const uniqueMembers = [];
  
  // Add Owner first if they exist so they appear at the top of the list
  if (board?.owner) {
    uniqueMembers.push({
      ...board.owner,
      role: "owner"
    });
  }

  // Iterate over members array and map their actual role based on the admins array
  if (board?.members) {
    board.members.forEach(member => {
      // Exclude the owner since they are already added manually above
      if (member && member._id !== ownerId) {
        const isUserAdmin = board.admins?.some(admin => (admin._id || admin) === member._id);
        uniqueMembers.push({
          ...member,
          role: isUserAdmin ? "admin" : "member"
        });
      }
    });
  }

  /**
   * Dispatches the member management action to the backend.
   * Actions: "promote" (member -> admin), "demote" (admin -> member), "remove".
   */
  const handleAction = async (memberId, action) => {
    setError("");
    setLoadingId(memberId + "-" + action);
    try {
      await manageBoardMember(board._id, memberId, action);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to perform action: ${action}`);
    } finally {
      setLoadingId("");
    }
  };

  /**
   * Accepts or Rejects a user's join request.
   */
  const handleRequestAction = async (userId, action) => {
    setError("");
    setLoadingId(userId + "-" + action);
    try {
      await handleJoinRequest(board._id, userId, action);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} join request`);
    } finally {
      setLoadingId("");
    }
  };

  // Listen for Escape key to close the modal
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Handle clicking the modal backdrop
  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 relative flex flex-col max-h-[85vh] animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Board Members</h3>
            <p className="text-xs text-gray-400">View and manage members of "{board?.title}"</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 rounded-full hover:bg-gray-50 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Global Error Message */}
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Join Requests section - visible to owner and admins */}
        {(isOwner || isAdmin) && board?.pendingRequests && board.pendingRequests.length > 0 && (
          <div className="mb-5 border-b border-gray-100 pb-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 text-left">
              Join Requests ({board.pendingRequests.length})
            </h4>
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {board.pendingRequests.map((reqItem) => {
                const u = reqItem.user;
                if (!u) return null;
                const reqId = u._id;
                
                return (
                  <div
                    key={reqId}
                    className="flex items-center justify-between p-2.5 rounded-2xl border border-amber-100 bg-amber-50/20 hover:bg-amber-50/40 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          u.name?.charAt(0).toUpperCase() || "R"
                        )}
                      </div>
                      <div className="truncate text-left">
                        <div className="font-bold text-gray-800 text-xs truncate">{u.name}</div>
                        <div className="text-[10px] text-gray-400 truncate">{u.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleRequestAction(reqId, "accept")}
                        disabled={loadingId === reqId + "-accept" || loadingId === reqId + "-reject"}
                        className="text-[11px] font-bold px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all shadow-xs cursor-pointer"
                      >
                        {loadingId === reqId + "-accept" ? "..." : "Accept"}
                      </button>
                      <button
                        onClick={() => handleRequestAction(reqId, "reject")}
                        disabled={loadingId === reqId + "-accept" || loadingId === reqId + "-reject"}
                        className="text-[11px] font-semibold px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all cursor-pointer"
                      >
                        {loadingId === reqId + "-reject" ? "..." : "Reject"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Member List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {uniqueMembers.map((member) => {
            const isMe = member._id === currentUser?._id;
            const isTargetOwner = member.role === "owner";
            const isTargetAdmin = member.role === "admin";
            const isTargetMember = member.role === "member";

            // ── Permissions Logic ──
            // Owners can remove anyone but themselves. Admins can only remove regular members.
            const canRemove = !isTargetOwner && (
              isOwner || (isAdmin && isTargetMember)
            );
            // Only owners can promote/demote admins
            const canPromote = isOwner && isTargetMember;
            const canDemote = isOwner && isTargetAdmin;

            return (
              <div
                key={member._id}
                className="flex items-center justify-between p-3 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-gray-50/80 transition-all duration-200"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      member.name?.charAt(0).toUpperCase() || "M"
                    )}
                  </div>

                  {/* Name / Email */}
                  <div className="truncate text-left">
                    <div className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                      <span className="truncate">{member.name}</span>
                      {isMe && (
                        <span className="bg-primary-50 text-primary-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 truncate">{member.email}</div>
                  </div>
                </div>

                {/* Role badge and controls */}
                <div className="flex items-center gap-2 shrink-0">
                  
                  {/* Role Badge with conditional coloring */}
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isTargetOwner
                        ? "bg-amber-50 text-amber-600 border border-amber-100"
                        : isTargetAdmin
                        ? "bg-purple-50 text-purple-600 border border-purple-100"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {member.role}
                  </span>

                  {/* Actions Dropdown / Buttons */}
                  <div className="flex items-center gap-1.5">
                    {canPromote && (
                      <button
                        onClick={() => handleAction(member._id, "promote")}
                        disabled={loadingId === member._id + "-promote"}
                        className="text-xs font-semibold px-2 py-1 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-all"
                      >
                        {loadingId === member._id + "-promote" ? "..." : "Make Admin"}
                      </button>
                    )}
                    
                    {canDemote && (
                      <button
                        onClick={() => handleAction(member._id, "demote")}
                        disabled={loadingId === member._id + "-demote"}
                        className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-all"
                      >
                        {loadingId === member._id + "-demote" ? "..." : "Demote"}
                      </button>
                    )}
                    
                    {canRemove && (
                      <button
                        onClick={() => handleAction(member._id, "remove")}
                        disabled={loadingId === member._id + "-remove"}
                        className="text-xs font-semibold px-2 py-1 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-all"
                      >
                        {loadingId === member._id + "-remove" ? "Removing..." : "Remove"}
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MembersModal;
