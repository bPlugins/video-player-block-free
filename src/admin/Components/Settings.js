import { useState } from "react";
import { __ } from "@wordpress/i18n";

const Settings = ({ deleteDataOnUninstall, uninstallNonce, adminUrl }) => {
  const [enabled, setEnabled] = useState(deleteDataOnUninstall);
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = () => {
    const newValue = !enabled;

    // Show confirm dialog when enabling (destructive action)
    if (newValue) {
      const confirmed = window.confirm(
        __(
          "Are you sure? This will permanently delete all Video Gallery Block posts and settings when the plugin is uninstalled.",
          "video-player",
        ),
      );

      if (!confirmed) return;
    }

    setIsLoading(true);
    setNotice("");

    const formData = new FormData();
    formData.append("action", "vpbpSaveUninstallOption");
    formData.append("nonce", uninstallNonce);
    formData.append("enabled", String(newValue));

    fetch(`${adminUrl}admin-ajax.php`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setEnabled(res.data.enabled);
          setNotice(res.data.message);
        } else {
          setNotice(
            res.data?.message ||
              __("Failed to save setting.", "video-player"),
          );
        }
      })
      .catch(() => {
        setNotice(
          __("Failed to save setting. Network error.", "video-player"),
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="bPlDashboardSettings bPlDashboardCard">
      <h2>{__("Delete Data on Uninstall", "video-player")}</h2>

      <p>
        {__(
          "When enabled, all plugin data will be permanently deleted when you uninstall (delete) the plugin. This includes:",
          "video-player",
        )}
      </p>

      <ul>
        <li>{__("All video player block posts", "video-player")}</li>
        <li>
          {__("All plugin settings and configurations", "video-player")}
        </li>
      </ul>

      <p className="settingsWarning">
        {__(
          "⚠️ This action cannot be undone. Your data will be safe if you only deactivate the plugin.",
          "video-player",
        )}
      </p>

      <div className="settingsControl">
        <label className="toggleControl">
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggle}
            disabled={isLoading}
          />

          <span className="toggleSlider" />
        </label>

        <span className="toggleLabel">
          {enabled
            ? __("Data will be deleted on uninstall", "video-player")
            : __("Data will be preserved on uninstall", "video-player")}
        </span>
      </div>

      {notice && (
        <div className={`settingsNotice ${enabled ? "warning" : "success"}`}>
          {notice}
        </div>
      )}
    </div>
  );
};
export default Settings;
