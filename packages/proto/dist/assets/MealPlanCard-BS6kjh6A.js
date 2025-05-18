import{i as l,r as f,a as u,x as h,n as c}from"./PageHeader-Bjb32J5Z.js";var d=Object.defineProperty,p=(i,o,a,v)=>{for(var r=void 0,s=i.length-1,n;s>=0;s--)(n=i[s])&&(r=n(o,a,r)||r);return r&&d(o,a,r),r};const t=class t extends l{constructor(){super(...arguments),this.title="",this.href=""}render(){return h`
      <a href=${this.href}>
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-meal-plan"></use>
        </svg>
        ${this.title}
      </a>
    `}};t.styles=[f.styles,u`
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
    `];let e=t;p([c()],e.prototype,"title");p([c()],e.prototype,"href");export{e as M};
