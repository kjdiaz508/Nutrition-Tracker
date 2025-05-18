import { css } from "lit";

const styles = css`
  * {
    margin: 0;
    box-sizing: border-box;
  }

  img {
    max-width: 100%;
  }

  ul,
  menu {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
  }
  
  svg.icon,
  svg.icon-no-fill {
    display: inline;
    height: 2em;
    width: 2em;
    vertical-align: top;
  }
  svg.icon {
    fill: currentColor;
  }
  
  .card {
  background-color: var(--color-background-card);
  padding: var(--space-md);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin-bottom: var(--space-sm);
}
.card ul,
.card p,
.card ol {
  margin-bottom: var(--space-sm);
`;

export default { styles };
