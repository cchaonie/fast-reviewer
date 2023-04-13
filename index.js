const close = document.getElementById("close");

const open = document.getElementById("open");

function getSelectedValues(target) {
    const values = [];
    for (const op of target.selectedOptions) {
        values.push(op.value);
    }
    return values;
}

close.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const values = getSelectedValues(document.getElementById("close_target"));

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleVisibility,
        args: [values, 0],
    });
});

open.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const values = getSelectedValues(document.getElementById("open_target"));

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: toggleVisibility,
        args: [values, 1],
    });
});

/**
 *
 * @param {*} extension file extension
 * @param {*} visibility 0 for close, 1 for open
 */
function toggleVisibility(extensions, visibility) {
    const articles = document.querySelectorAll("article");
    articles.forEach(article => {
        const ariaLabel = article.getAttribute("aria-label");

        extensions.forEach(extension => {
            if (ariaLabel && ariaLabel.endsWith(extension)) {
                const header = article.querySelector(
                    "[data-testid=file-header]"
                );
                const content = article.querySelector(
                    `[aria-hidden=${visibility === 0 ? "false" : "true"}]`
                );
                if (header && content) {
                    header.click();
                }
            }
        });
    });
}
