/**
 * Sets up Vimeo quality selector inside Plyr's settings menu.
 *
 * Vimeo changes which qualities it offers while the video runs (player size,
 * connection): e.g. 1080p is listed before playback and gone after. The menu
 * used to be built once, so it could offer a quality Vimeo no longer had.
 * Picking it did nothing, and because Vimeo never answered that request, the
 * next answer was matched to it: from then on the menu showed the quality
 * picked one step earlier. So now:
 * - the list is rebuilt from Vimeo every time the Quality menu is opened,
 * - setQuality() is only called for a quality Vimeo offers right now,
 * - the checked item and the label come from what Vimeo reports it is playing
 *   (getQuality / qualitychange), never from the setQuality() promise.
 *
 * Safe to call repeatedly: later calls only refresh the list.
 *
 * @param {Object} player - The Plyr instance.
 */
export const setupVimeoQuality = (player) => {
  if (!player) return;

  const vimeo = player.embed;
  if (!vimeo || typeof vimeo.getQualities !== "function") return;

  const settings = player.elements?.settings;
  if (!settings) return;

  const { buttons, panels, menu } = settings;
  const qualityBtn = buttons?.quality;
  const qualityPanel = panels?.quality;
  if (!qualityBtn || !qualityPanel) return;

  const menuEl = qualityPanel.querySelector('[role="menu"]');
  if (!menuEl) return;

  // Already wired up for this player: just bring the list up to date.
  if (qualityPanel.vpbVimeoQuality) {
    qualityPanel.vpbVimeoQuality.refresh();
    return;
  }

  const doc = qualityPanel.ownerDocument || document;
  let current = []; // qualities as Vimeo last listed them

  const labelOf = (id) => {
    const match = current.find((q) => q.id === id);
    return match?.label || id || "";
  };

  // Mark what Vimeo is actually playing.
  const setActive = (activeId) => {
    if (!activeId) return;
    const valEl = qualityBtn.querySelector(".plyr__menu__value");
    if (valEl) valEl.textContent = labelOf(activeId);
    menuEl.querySelectorAll('button[role="menuitemradio"]').forEach((btn) => {
      btn.setAttribute(
        "aria-checked",
        btn.getAttribute("value") === String(activeId) ? "true" : "false",
      );
    });
  };

  const syncActive = () => {
    if (typeof vimeo.getQuality !== "function") return;
    vimeo.getQuality().then(setActive).catch(() => {});
  };

  const showHome = () => {
    const backBtn = qualityPanel.querySelector(".plyr__control--back");
    if (backBtn) {
      backBtn.click();
    } else {
      qualityPanel.setAttribute("hidden", "");
      panels.home?.removeAttribute("hidden");
    }
  };

  // Highest first, "auto" last (e.g. 1080p, 720p, 540p, 360p, auto).
  const sortQualities = (qualities) =>
    [...qualities].sort((a, b) => {
      if (a.id === "auto") return 1;
      if (b.id === "auto") return -1;
      return (parseInt(b.id, 10) || 0) - (parseInt(a.id, 10) || 0);
    });

  let choosing = false;
  const choose = (id) => {
    if (choosing) return;
    choosing = true;
    vimeo
      .getQualities()
      .then((latest) => {
        const list = Array.isArray(latest) ? latest : [];
        if (!list.some((q) => q.id === id)) {
          // No longer offered: show the real list instead of asking for it.
          render(list);
          return false;
        }
        return vimeo.setQuality(id).then(() => true);
      })
      .catch(() => false)
      .then((changed) => {
        choosing = false;
        syncActive();
        if (changed !== false) showHome();
      });
  };

  function render(qualities) {
    if (!Array.isArray(qualities) || qualities.length <= 1) return;
    current = sortQualities(qualities);

    menuEl.innerHTML = "";
    current.forEach((q) => {
      const btn = doc.createElement("button");
      btn.type = "button";
      btn.setAttribute("role", "menuitemradio");
      btn.className = "plyr__control";
      btn.setAttribute("aria-checked", q.active ? "true" : "false");
      btn.setAttribute("value", q.id);

      const span = doc.createElement("span");
      span.textContent = q.label || q.id;

      // HD badge for 720p and higher
      const resNum = parseInt(q.id, 10);
      if (!isNaN(resNum) && resNum >= 720) {
        const badge = doc.createElement("span");
        badge.className = "plyr__badge";
        badge.textContent = "HD";
        badge.style.marginLeft = "6px";
        span.appendChild(badge);
      }

      btn.appendChild(span);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        choose(q.id);
      });
      menuEl.appendChild(btn);
    });

    const active = current.find((q) => q.active) || current[current.length - 1];
    if (active) setActive(active.id);

    // Make Quality button visible in settings menu
    qualityBtn.removeAttribute("hidden");
    if (menu) menu.removeAttribute("hidden");
  }

  const refresh = () => {
    vimeo
      .getQualities()
      .then(render)
      .catch(() => {
        // Quality selection not supported for this specific video
      });
  };

  qualityPanel.vpbVimeoQuality = { refresh };

  // Fresh list every time the Quality menu is opened.
  qualityBtn.addEventListener("click", refresh, true);

  // Vimeo's own quality switches (e.g. Auto stepping down) and our picks.
  if (typeof vimeo.on === "function") {
    vimeo.on("qualitychange", (data) => {
      if (data?.quality) setActive(data.quality);
    });
  }

  refresh();
};
