import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

// Announcement configuration - easy to modify or extend
const ANNOUNCEMENT_CONFIG = {
  id: "lml-gig-explorer-launch-aug-2025",
  storageKey: "lml-gig-explorer-launch-aug-2025-seen",
  title: "Hi there!",
  message: () => (
    <>
      <p>
        If you have visited us before, you may notice that the site has changed.
        We have put the gig guide front and centre of{" "}
        <a href="https://www.livemusiclocator.com.au">
          LiveMusicLocator.com.au
        </a>
      </p>
      <p>
        If you're looking for content from the old site, don't worry - it's all
        here. You will find it all in the <a href="/about">about menu</a>.
      </p>
      <p>
        Oh, and the URL <a href="https://lml.live">lml.live</a> still works just
        as it did before, natch.
      </p>
    </>
  ),
  dismissText: "Got it!",
  expiryDate: new Date("2025-08-18"), // 2 weeks from now
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
const useAnnouncementState = (config) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const storage = useLocalStorage();

  const isExpired = () => {
    const now = new Date();
    return now > config.expiryDate;
  };

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
    if (isExpired()) return;
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
    if (!isExpired() && !hasBeenSeen()) {
      show();
    }
  }, []);

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
    <div className="px-6 py-4 mx-auto max-w-[85vw]">
      <div className="prose prose-sm prose-slate prose-invert max-w-none">
        <h3>{config.title}</h3>
        {config.message()}
      </div>

      {/* Action area */}
      <div className="mt-3 flex justify-center space-x-4">
        <button
          onClick={onClose}
          className="tag !font-bold rounded-xs hover:!scale-110"
        >
          {config.dismissText}
        </button>
      </div>
    </div>
  );
};

const AnnouncementNotification = forwardRef(({ config }, ref) => {
  const announcement = useAnnouncementState(config);
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
            ? "max-h-64 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-full"
        }`}
      >
        <AnnouncementContent config={config} onClose={announcement.hide} />
      </div>
    </div>
  );
});

// Main Announcements component that manages everything
const Announcements = () => {
  const notificationRef = React.useRef(null);

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
    />
  );
};

export default Announcements;
