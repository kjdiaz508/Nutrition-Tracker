const label = document.getElementById("themeToggle");
const body = document.body;
const checkbox = label.querySelector('input[type="checkbox"]');

label.onchange = (e) => {
  e.stopPropagation();

  label.dispatchEvent(
    new CustomEvent("darkmode:toggle", {
      bubbles: true,
      detail: { checked: e.target.checked },
    })
  );
};

body.addEventListener("darkmode:toggle", (e) => {
  const { checked } = e.detail;
  body.classList.toggle("dark-mode", checked);
});
