// general.css.ts
import { css } from "lit";

export const cardStyles = css`
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
  }
`;

export const headingStyles = css`
  h1, h2, h3, h4, h5 {
    color: var(--color-accent);
    font-family: var(--font-family-heading);
  }
`;

export const sequenceStyles = css`
  .sequence {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .row-sequence {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }
`;

export const sectionStyles = css`
  .section {
    margin-top: var(--space-lg);
  }

  .section h2 {
    margin-bottom: var(--space-sm);
  }
`;

export const buttonLinkStyles = css`
  .button-link {
    display: inline-block;
    background-color: var(--color-accent);
    color: white;
    padding: var(--space-sm) var(--space-md);
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.2s ease;
  }

  .button-link:hover {
    background-color: #c75c1d;
  }
`;
