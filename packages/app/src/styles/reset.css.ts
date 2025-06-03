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

  mpn-card h2 {
    margin-bottom: var(--space-sm);
    color: var(--color-accent);
    font-family: var(--font-family-heading);
  }

  mpn-card p,
  mpn-card ul,
  mpn-card ol {
    margin-bottom: var(--space-sm);
  }
`;

export default { styles };
