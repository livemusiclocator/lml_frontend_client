import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";

import { CloseIcon } from "./Icons";
import { useGigSearchParams } from "../../hooks/api";
import voteVicMusicImage from "../../assets/votevicmusic.png";

// Announcement configuration - easy to modify or extend
const ANNOUNCEMENT_CONFIG = {
  id: "lml-vote-vic-music-2026",
  storageKey: "lml-vote-vic-music-2026-seen",
  title: "Vote Vic Music",
  message: () => (
    <>
      <p>
        Add your voice to the future of Victorian music ahead of the Victorian
        Election on Saturday 28 November 2026
      </p>
      <p>
        <img src={voteVicMusicImage} alt="Vote Vic Music" />
      </p>
    </>
  ),
  dismissText: "Got it!",
  // a Victorian election announcement is pointless once the election is over
  expiryDate: new Date("2026-11-29"),
  // this is a Victorian campaign - no interest to our Brisbane audience
  hiddenLocationIds: ["brisbane"],
};

// Custom hook for localStorage functionality
const useLocalStorage = () => {
  const isAvailable = () => {
    try {
      const test = "test";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  };

  const getItem = (key) => {
    if (!isAvailable()) return null;
    return localStorage.getItem(key);
  };

  const setItem = (key, value) => {
    if (!isAvailable()) return false;
    localStorage.setItem(key, value);
    return true;
  };

  return { isAvailable, getItem, setItem };
};

// Custom hook for transition end handling
const useTransitionEnd = (callback, dependencies = []) => {
  const elementRef = React.useRef(null);

  const handleTransitionEnd = React.useCallback(callback, dependencies);

  React.useEffect(() => {
    const element = elementRef.current;
    if (element) {
      element.addEventListener("transitionend", handleTransitionEnd);
      return () =>
        element.removeEventListener("transitionend", handleTransitionEnd);
    }
  }, [handleTransitionEnd]);

  return elementRef;
};

// Custom hook for announcement logic
//
// todo: this is all a bit messy and probably a bit overkill. simplify with library perhaps?
const useAnnouncementState = (config, enabled = true) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const storage = useLocalStorage();

  const isExpired = useCallback(() => {
    const now = new Date();
    return now > config.expiryDate;
  }, [config]);

  const hasBeenSeen = () => {
    // If localStorage isn't available, assume it's been seen to avoid annoying users
    if (!storage.isAvailable()) return true;
    return storage.getItem(config.storageKey);
  };

  const markAsSeen = () => {
    if (!hasBeenSeen()) {
      storage.setItem(config.storageKey, "true");
    }
  };

  const show = () => {
    if (isExpired() || !enabled) return;
    setIsVisible(true);
    requestAnimationFrame(() => setIsExpanded(true));
  };

  const hide = () => {
    setIsExpanded(false);
    markAsSeen();
  };

  const handleTransitionEnd = (event) => {
    if (
      event.target === event.currentTarget &&
      !isExpanded &&
      event.propertyName === "opacity"
    ) {
      setIsVisible(false);
    }
  };

  // Auto-show on first visit
  useEffect(() => {
    if (enabled && !isExpired() && !hasBeenSeen()) {
      show();
    }
  }, [enabled, hasBeenSeen, isExpired, show]);

  return {
    isVisible,
    isExpanded,
    show,
    hide,
    handleTransitionEnd,
  };
};

// Content component for the announcement markup
const AnnouncementContent = ({ config, onClose }) => {
  return (
    <div className="announcements-modal mx-auto p-4">
      <div className="announcement-body prose prose-sm prose-slate prose-invert max-w-none">
        <h3>{config.title}</h3>
        {config.message()}
      </div>

      {/* Action area */}
      <div className="announcement-action-area">
        <button
          onClick={onClose}
          className="tag !font-bold rounded-xs hover:!scale-110"
        >
          {config.dismissText}
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        title="Close"
        className="announcement-close-button p-2 text-xs text-white ring-1 ring-slate-400  rounded-lg hover:bg-slate-600 focus:ring-2 focus:outline-none"
      >
        <CloseIcon />
      </button>
    </div>
  );
};

const AnnouncementNotification = forwardRef(({ config, enabled }, ref) => {
  const announcement = useAnnouncementState(config, enabled);
  const notificationRef = useTransitionEnd(announcement.handleTransitionEnd, [
    announcement.isExpanded,
  ]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    showNotification: announcement.show,
    hideNotification: announcement.hide,
    isNotificationVisible: () => announcement.isVisible,
  }));

  if (!announcement.isVisible) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <div
        ref={notificationRef}
        className={`bg-gray-700 text-white shadow-lg transition-all duration-300 ease-out overflow-hidden ${
          announcement.isExpanded
            ? "max-h-dvh opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-full"
        }`}
      >
        <AnnouncementContent config={config} onClose={announcement.hide} />
      </div>
    </div>
  );
});

AnnouncementNotification.displayName = AnnouncementNotification;

// Main Announcements component that manages everything
const Announcements = () => {
  const notificationRef = React.useRef(null);
  const { locationId } = useGigSearchParams();
  const enabled = !(ANNOUNCEMENT_CONFIG.hiddenLocationIds || []).includes(
    locationId,
  );

  React.useEffect(() => {
    // Expose announcement controls to global window object for external apps
    window.announcements = {
      show: () => notificationRef.current?.showNotification(),
      hide: () => notificationRef.current?.hideNotification(),
      isVisible: () =>
        notificationRef.current?.isNotificationVisible() || false,
      config: ANNOUNCEMENT_CONFIG, // Expose config for debugging/info
    };

    // Cleanup on unmount
    return () => {
      delete window.announcements;
    };
  }, []);

  return (
    <AnnouncementNotification
      ref={notificationRef}
      config={ANNOUNCEMENT_CONFIG}
      enabled={enabled}
    />
  );
};

export default Announcements;
