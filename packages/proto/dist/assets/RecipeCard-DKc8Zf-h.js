import{i as f,r as p,a as h,x as u,n as c}from"./PageHeader-Bjb32J5Z.js";var d=Object.defineProperty,l=(i,o,a,v)=>{for(var r=void 0,s=i.length-1,n;s>=0;s--)(n=i[s])&&(r=n(o,a,r)||r);return r&&d(o,a,r),r};const t=class t extends f{constructor(){super(...arguments),this.title="",this.href=""}render(){return u`
      <a href=${this.href}>
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-recipe-checklist"></use>
        </svg>
        ${this.title}
      </a>
    `}};t.styles=[p.styles,h`
      a {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        padding: 4px 0;
        text-decoration: none;
        border-radius: 6px;
        background-color: var(--color-surface);
        color: var(--color-link);
      }
    `];let e=t;l([c()],e.prototype,"title");l([c()],e.prototype,"href");export{e as R};
