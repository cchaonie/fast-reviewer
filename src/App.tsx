import { useEffect } from "react";

import "./App.css";

export const App = () => {
  useEffect(() => {
    const close = document.getElementById("close");
    const open = document.getElementById("open");

    function getSelectedValues(target: HTMLSelectElement) {
      const values: string[] = [];
      for (const op of target.selectedOptions) {
        values.push(op.value);
      }
      return values;
    }

    /**
     * @param {*} extension file extension
     * @param {*} visibility 0 for close, 1 for open
     */
    function toggleVisibility(extensions: string[], visibility: number) {
      const articles = document.querySelectorAll("article");
      articles.forEach((article) => {
        const ariaLabel = article.getAttribute("aria-label");

        extensions.forEach((extension) => {
          if (ariaLabel && new RegExp(extension).test(ariaLabel)) {
            const header = article.querySelector<HTMLDivElement>(
              "[data-testid=file-header]"
            );
            const content = article.querySelector(
              `[aria-hidden=${
                visibility === 0 ? "false" : "true"
              }] [data-testid=file-content]`
            );
            if (header && content) {
              header.click();
            }
          }
        });
      });
    }

    const closeClickHandler = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const values = getSelectedValues(
        document.getElementById("close_target") as HTMLSelectElement
      );

      chrome.scripting.executeScript<[string[], number], void>({
        target: { tabId: tab.id },
        func: toggleVisibility,
        args: [values, 0],
      });
    };

    const openClickHandler = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const values = getSelectedValues(
        document.getElementById("open_target") as HTMLSelectElement
      );

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: toggleVisibility,
        args: [values, 1],
      });
    };

    close.addEventListener("click", closeClickHandler);
    open.addEventListener("click", openClickHandler);

    return () => {
      close.removeEventListener("click", closeClickHandler);
      open.removeEventListener("click", openClickHandler);
    };
  }, []);

  return (
    <div className="w-80 p-2">
      <h1>To Review Faster</h1>
      <p>
        use <strong>Command</strong> to select multiple option
      </p>
      <div className="panel mt-2">
        <div className="action">
          <div>
            <button type="button" className="border px-2 py-1" id="close">
              CLOSE
            </button>
          </div>
          <div>
            <select id="close_target" multiple>
              <option selected value=".test.tsx?">
                .test.tsx?
              </option>
              <option value=".story.tsx?">.story.tsx?</option>
              <option value=".test.tsx?.snap">.test.tsx?.snap</option>
            </select>
          </div>
        </div>
        <div className="action">
          <div>
            <button type="button" className="border px-2 py-1" id="open">
              OPEN
            </button>
          </div>
          <div>
            <select id="open_target" multiple>
              <option selected value=".test.tsx?">
                .test.tsx?
              </option>
              <option value=".story.tsx?">.story.tsx?</option>
              <option value=".test.tsx?.snap">.test.tsx?.snap</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
