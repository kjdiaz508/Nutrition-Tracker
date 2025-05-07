import{i as r,x as s,r as c,a as e}from"./reset.css-CWSYUagB.js";const a=class a extends r{render(){return s`
      <section>
        <h2>Ingredients</h2>
        <ul>
          <slot></slot>
        </ul>
      </section>
    `}};a.styles=[c.styles,e`
      section {
        background-color: var(--color-background-card);
        padding: var(--space-md);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      h2 {
        font-family: var(--font-family-heading);
        color: var(--color-accent);
        margin-bottom: var(--space-sm);
      }

      ul {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
      }
    `];let o=a;export{o as I};
